import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const stories = await prisma.userStory.findMany({
      where: { projectId: params.projectId },
    });

    const totalStories = stories.length;
    const completedStories = stories.filter(s => s.status === 'DONE').length;
    const inProgressStories = stories.filter(s => s.status === 'IN_PROGRESS').length;
    const pendingStories = stories.filter(s => s.status === 'TODO').length;

    // Calcular story points (simulados por ahora)
    const totalStoryPoints = stories.reduce((acc, story) => acc + (story.priority || 1), 0);
    const completedStoryPoints = stories
      .filter(s => s.status === 'DONE')
      .reduce((acc, story) => acc + (story.priority || 1), 0);

    return NextResponse.json({
      totalStories,
      completedStories,
      inProgressStories,
      pendingStories,
      totalStoryPoints,
      completedStoryPoints,
    });
  } catch (error) {
    console.error("Error fetching stories metrics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}