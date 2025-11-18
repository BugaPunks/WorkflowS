import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { projectId: string; channelId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get URL parameters for pagination
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const before = url.searchParams.get('before');

    let whereClause: any = {
      channelId: params.channelId,
    };

    // Add pagination
    if (before) {
      whereClause.createdAt = {
        lt: new Date(before),
      };
    }

    const messages = await prisma.message.findMany({
      where: whereClause,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        replyTo: {
          select: {
            id: true,
            content: true,
            sender: {
              select: {
                name: true,
              },
            },
          },
        },
        replies: {
          select: {
            id: true,
            content: true,
            sender: {
              select: {
                name: true,
              },
            },
            createdAt: true,
          },
          orderBy: { createdAt: 'asc' },
        },
        readBy: {
          where: {
            userId: session.user.id,
          },
          select: {
            readAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    // Mark messages as read
    const unreadMessages = messages.filter(msg => msg.readBy.length === 0);
    if (unreadMessages.length > 0) {
      await prisma.messageRead.createMany({
        data: unreadMessages.map(msg => ({
          messageId: msg.id,
          userId: session.user.id,
        })),
      });
    }

    return NextResponse.json(messages.reverse()); // Return in chronological order
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { projectId: string; channelId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { content, replyToId } = body;

    if (!content) {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    // Verify user has access to the channel
    const channel = await prisma.chatChannel.findUnique({
      where: { id: params.channelId },
      select: { projectId: true },
    });

    if (!channel || channel.projectId !== params.projectId) {
      return NextResponse.json({ error: "Channel not found" }, { status: 404 });
    }

    // Verify user is member of the project
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

    const message = await prisma.message.create({
      data: {
        content,
        channelId: params.channelId,
        senderId: session.user.id,
        replyToId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        replyTo: {
          select: {
            id: true,
            content: true,
            sender: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}