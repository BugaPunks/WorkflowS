
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


// GET all documents for a project
export async function GET(req: NextRequest, { params }: { params: { projectId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const documents = await prisma.document.findMany({
      where: { projectId: params.projectId },
      include: { uploadedBy: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(documents);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// "Upload" a new document to a project
export async function POST(req: NextRequest, { params }: { params: { projectId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const body = await req.json();
    const { filename, url, filetype, taskId } = body;

    if (!filename || !url || !filetype) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const document = await prisma.document.create({
      data: {
        filename,
        url, // In a real app, this URL would come from a file storage service
        filetype,
        projectId: params.projectId,
        taskId: taskId || null,
        uploadedById: session.user.id,
      },
    });

    return NextResponse.json(document);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
