import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// GET all project data for export
export async function GET(req: NextRequest, { params }: { params: { projectId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const project = await prisma.project.findUnique({
      where: { id: params.projectId },
      include: {
        users: { include: { user: { select: { name: true, email: true } } } },
        sprints: {
          include: {
            stories: {
              include: {
                tasks: {
                  include: {
                    assignedTo: { select: { name: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!project) {
      return new NextResponse("Project not found", { status: 404 });
    }

    // Return the data as a JSON file for download
    return new NextResponse(JSON.stringify(project, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="project-export-${project.name.replace(/\s/g, '_')}-${new Date().toISOString().slice(0,10)}.json"`,
      },
    });

  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
