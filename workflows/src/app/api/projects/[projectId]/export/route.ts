
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { format = 'JSON', include = ['all'] } = body;

    // Verify user has access to project
    const projectUser = await prisma.projectUser.findUnique({
      where: {
        userId_projectId: {
          userId: session.user.id,
          projectId: params.projectId,
        },
      },
    });

    if (!projectUser) {
      return NextResponse.json({ error: "Not a member of this project" }, { status: 403 });
    }

    // Create export record
    const exportRecord = await prisma.exportHistory.create({
      data: {
        userId: session.user.id,
        projectId: params.projectId,
        type: 'PROJECT',
        format: format as any,
        fileName: `project-${params.projectId}-export.${format.toLowerCase()}`,
        status: 'processing',
      },
    });

    // Get project data
    const project = await prisma.project.findUnique({
      where: { id: params.projectId },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        stories: {
          include: {
            tasks: {
              include: {
                assignedTo: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
            sprint: true,
          },
        },
        sprints: true,
        evaluations: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            evaluator: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Generate export data based on format
    let exportData: any;
    let contentType: string;
    let fileExtension: string;

    switch (format.toUpperCase()) {
      case 'JSON':
        exportData = generateJSONExport(project, include);
        contentType = 'application/json';
        fileExtension = 'json';
        break;
      case 'CSV':
        exportData = generateCSVExport(project, include);
        contentType = 'text/csv';
        fileExtension = 'csv';
        break;
      default:
        exportData = generateJSONExport(project, include);
        contentType = 'application/json';
        fileExtension = 'json';
    }

    // Update export record as completed
    await prisma.exportHistory.update({
      where: { id: exportRecord.id },
      data: {
        status: 'completed',
        fileSize: Buffer.byteLength(JSON.stringify(exportData), 'utf8'),
        completedAt: new Date(),
      },
    });

    const fileName = `project-${params.projectId}-export.${fileExtension}`;

    return new NextResponse(exportData, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });

  } catch (error) {
    console.error("Error exporting project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function generateJSONExport(project: any, include: string[]) {
  const exportData: any = {
    project: {
      id: project.id,
      name: project.name,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
      exportedAt: new Date().toISOString(),
    },
    team: project.users.map((pu: any) => ({
      id: pu.user.id,
      name: pu.user.name,
      email: pu.user.email,
      role: pu.role,
    })),
  };

  if (include.includes('all') || include.includes('stories')) {
    exportData.stories = project.stories.map((story: any) => ({
      id: story.id,
      title: story.title,
      description: story.description,
      priority: story.priority,
      status: story.status,
      acceptanceCriteria: story.acceptanceCriteria,
      storyPoints: story.storyPoints,
      sprint: story.sprint ? {
        id: story.sprint.id,
        name: story.sprint.name,
      } : null,
      tasks: story.tasks.map((task: any) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        assignedTo: task.assignedTo ? {
          id: task.assignedTo.id,
          name: task.assignedTo.name,
          email: task.assignedTo.email,
        } : null,
      })),
    }));
  }

  if (include.includes('all') || include.includes('sprints')) {
    exportData.sprints = project.sprints.map((sprint: any) => ({
      id: sprint.id,
      name: sprint.name,
      startDate: sprint.startDate,
      endDate: sprint.endDate,
    }));
  }

  if (include.includes('all') || include.includes('evaluations')) {
    exportData.evaluations = project.evaluations.map((evaluation: any) => ({
      id: evaluation.id,
      sprintId: evaluation.sprintId,
      student: {
        id: evaluation.student.id,
        name: evaluation.student.name,
        email: evaluation.student.email,
      },
      evaluator: {
        id: evaluation.evaluator.id,
        name: evaluation.evaluator.name,
        email: evaluation.evaluator.email,
      },
      score: evaluation.score,
      feedback: evaluation.feedback,
      evaluatedAt: evaluation.createdAt,
    }));
  }

  return JSON.stringify(exportData, null, 2);
}

function generateCSVExport(project: any, include: string[]) {
  let csv = '';

  // Tasks CSV
  if (include.includes('all') || include.includes('tasks')) {
    csv += 'Tasks\n';
    csv += 'ID,Title,Description,Status,Assigned To,Story\n';

    project.stories.forEach((story: any) => {
      story.tasks.forEach((task: any) => {
        csv += `"${task.id}","${task.title}","${task.description}","${task.status}","${task.assignedTo?.name || ''}","${story.title}"\n`;
      });
    });
    csv += '\n';
  }

  // Evaluations CSV
  if (include.includes('all') || include.includes('evaluations')) {
    csv += 'Evaluations\n';
    csv += 'Student,Evaluator,Score,Feedback,Date\n';

    project.evaluations.forEach((evaluation: any) => {
      csv += `"${evaluation.student.name}","${evaluation.evaluator.name}","${evaluation.score}","${evaluation.feedback}","${evaluation.createdAt}"\n`;
    });
  }

  return csv;
}
