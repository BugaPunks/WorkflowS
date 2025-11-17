import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import moment from 'moment';

export async function GET(
  req: Request,
  { params }: { params: { sprintId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const sprint = await prisma.sprint.findUnique({
      where: { id: params.sprintId },
      include: {
        stories: {
          include: {
            tasks: true,
          },
        },
      },
    });

    if (!sprint) {
      return new NextResponse("Sprint not found", { status: 404 });
    }

    const totalStoryPoints = sprint.stories.reduce((acc, story) => {
      return acc + (story.tasks.reduce((taskAcc, task) => taskAcc + (task.storyPoints || 0), 0));
    }, 0);

    const startDate = moment(sprint.startDate);
    const endDate = moment(sprint.endDate);
    const sprintDuration = endDate.diff(startDate, 'days') + 1;

    const burndownData = [];
    let remainingWork = totalStoryPoints;

    for (let i = 0; i < sprintDuration; i++) {
      const currentDate = startDate.clone().add(i, 'days');
      const tasksCompletedOnDay = await prisma.task.findMany({
          where: {
              status: 'COMPLETED',
              updatedAt: {
                  gte: currentDate.startOf('day').toDate(),
                  lt: currentDate.endOf('day').toDate()
              },
              userStory: {
                  sprintId: sprint.id
              }
          }
      });

      const pointsCompleted = tasksCompletedOnDay.reduce((acc, task) => acc + (task.storyPoints || 0), 0);
      remainingWork -= pointsCompleted;

      burndownData.push({
        date: currentDate.format('YYYY-MM-DD'),
        remainingWork: remainingWork,
        idealWork: totalStoryPoints - (totalStoryPoints / (sprintDuration - 1)) * i,
      });
    }

    return NextResponse.json(burndownData);
  } catch (error) {
    console.error("Failed to generate burndown data:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
