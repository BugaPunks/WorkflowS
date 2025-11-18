
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


// GET unread notifications for the current user
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id,
        read: false,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(notifications);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Mark all notifications for the current user as read
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    await prisma.notification.updateMany({
      where: {
        userId: session.user.id,
        read: false,
      },
      data: {
        read: true,
      },
    });
    return new NextResponse(null, { status: 204 }); // No content
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
