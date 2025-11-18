import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface SearchResult {
  type: 'project' | 'task' | 'user' | 'story';
  id: string;
  title: string;
  subtitle?: string;
  url: string;
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  try {
    const results: SearchResult[] = [];

    // Search projects
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
        ],
        users: {
          some: {
            userId: session.user.id
          }
        }
      },
      take: 5
    });

    projects.forEach(project => {
      results.push({
        type: 'project',
        id: project.id,
        title: project.name,
        subtitle: project.description || undefined,
        url: `/projects/${project.id}`
      });
    });

    // Search user stories
    const stories = await prisma.userStory.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { description: { contains: query } },
        ],
        project: {
          users: {
            some: {
              userId: session.user.id
            }
          }
        }
      },
      take: 5
    });

    // Get project names for stories
    const storyIds = stories.map(s => s.id);
    const storyProjects = await prisma.userStory.findMany({
      where: { id: { in: storyIds } },
      include: { project: true }
    });

    const storyMap = new Map(storyProjects.map(sp => [sp.id, sp.project.name]));

    stories.forEach(story => {
      results.push({
        type: 'story',
        id: story.id,
        title: story.title,
        subtitle: `Proyecto: ${storyMap.get(story.id)}`,
        url: `/projects/${story.projectId}`
      });
    });

    // Search tasks
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { description: { contains: query } },
        ]
      },
      include: {
        assignedTo: true
      },
      take: 5
    });

    // Filter tasks by project membership
    const filteredTasks = [];
    for (const task of tasks) {
      const story = await prisma.userStory.findUnique({
        where: { id: task.userStoryId },
        include: { project: { include: { users: true } } }
      });
      if (story?.project?.users?.some((u: any) => u.userId === session.user.id)) {
        filteredTasks.push({
          ...task,
          projectName: story.project.name,
          projectId: story.project.id
        });
      }
    }

    filteredTasks.forEach(task => {
      results.push({
        type: 'task',
        id: task.id,
        title: task.title,
        subtitle: `Proyecto: ${task.projectName} • ${task.status}`,
        url: `/projects/${task.projectId}/board`
      });
    });

    // Search users (only if admin)
    if (session.user.role === 'ADMIN') {
      const users = await prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: query } },
            { email: { contains: query } },
          ]
        },
        take: 5
      });

      users.forEach(user => {
        results.push({
          type: 'user',
          id: user.id,
          title: user.name || user.email,
          subtitle: user.email,
          url: `/admin/users`
        });
      });
    }

    // Limit total results to 20
    return NextResponse.json(results.slice(0, 20));
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}