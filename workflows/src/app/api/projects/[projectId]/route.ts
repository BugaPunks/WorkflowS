import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

// Explicitly define the context type as expected by the Next.js build process.
// The key is that `params` is a Promise that resolves to the route parameters.
type RouteContext = {
  params: Promise<{
    projectId: string;
  }>;
};

export async function GET(req: NextRequest, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // Await the promise to get the actual params
    const { projectId } = await context.params;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        users: { include: { user: true } },
        stories: true,
      },
    });

    if (!project) {
      return new NextResponse("Project not found", { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
