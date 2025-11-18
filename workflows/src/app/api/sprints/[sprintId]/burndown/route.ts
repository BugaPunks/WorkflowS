
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


export async function GET(req: NextRequest, { params }: { params: { sprintId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const sprint = await prisma.sprint.findUnique({
      where: { id: params.sprintId },
      include: {
        stories: { include: { tasks: true } },
      },
    });

    if (!sprint) {
      return new NextResponse("Sprint not found", { status: 404 });
    }

    const tasks = sprint.stories.flatMap(story => story.tasks);
    const totalStoryPoints = tasks.reduce((sum, task) => sum + (task.storyPoints || 0), 0);

    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);
    const sprintDurationDays = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24) + 1;

    const burndownData = [];
    let remainingPoints = totalStoryPoints;

    for (let i = 0; i < sprintDurationDays; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);

      const pointsCompletedOnThisDay = tasks
        .filter(t => t.status === 'COMPLETED' && new Date(t.updatedAt).toISOString().slice(0, 10) === currentDate.toISOString().slice(0, 10))
        .reduce((sum, task) => sum + (task.storyPoints || 0), 0);

      remainingPoints -= pointsCompletedOnThisDay;

      burndownData.push({
        date: currentDate.toISOString().slice(0, 10),
        // Ideal burndown is a straight line from total to 0
        ideal: totalStoryPoints - (totalStoryPoints / (sprintDurationDays - 1)) * i,
        // Actual remaining points
        actual: remainingPoints,
      });
    }

    // Ensure the last day's actual points are correctly calculated if tasks were completed after the loop's last check
    const finalCompletedPoints = tasks
      .filter(t => t.status === 'COMPLETED')
      .reduce((sum, task) => sum + (task.storyPoints || 0), 0);

    if (burndownData.length > 0) {
      burndownData[burndownData.length - 1].actual = totalStoryPoints - finalCompletedPoints;
    }


    return NextResponse.json(burndownData);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
