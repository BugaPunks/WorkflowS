import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// DELETE a document
export async function DELETE(req: NextRequest, { params }: { params: { documentId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const document = await prisma.document.findUnique({
      where: { id: params.documentId },
    });

    if (!document) {
      return new NextResponse("Document not found", { status: 404 });
    }

    // Optional: Add logic here to ensure only the uploader or a project admin can delete
    // For now, any authenticated user in the project can delete.

    await prisma.document.delete({
      where: { id: params.documentId },
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
