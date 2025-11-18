import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Buscar el primer proyecto disponible
    const project = await prisma.project.findFirst({
      include: {
        users: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "No projects found" }, { status: 404 });
    }

    // Verificar si el usuario es miembro del proyecto
    const isMember = project.users.some(pu => pu.userId === session.user.id);
    if (!isMember) {
      return NextResponse.json({ error: "Not a member of any project" }, { status: 403 });
    }

    // Crear canal general si no existe
    let channel = await prisma.chatChannel.findFirst({
      where: {
        projectId: project.id,
        name: 'General',
      },
    });

    if (!channel) {
      channel = await prisma.chatChannel.create({
        data: {
          name: 'General',
          description: 'Canal general del proyecto',
          type: 'PROJECT',
          projectId: project.id,
          createdById: session.user.id,
        },
      });
    }

    // Crear mensajes de prueba si no existen
    const messageCount = await prisma.message.count({
      where: { channelId: channel.id },
    });

    if (messageCount === 0) {
      await prisma.message.createMany({
        data: [
          {
            content: '¡Bienvenidos al chat del proyecto! 🎉',
            channelId: channel.id,
            senderId: session.user.id,
          },
          {
            content: 'Este es el canal general para discutir temas del proyecto',
            channelId: channel.id,
            senderId: session.user.id,
          },
          {
            content: '¿Cómo va el progreso del sprint actual?',
            channelId: channel.id,
            senderId: session.user.id,
          },
        ],
      });
    }

    return NextResponse.json({
      message: 'Chat data initialized successfully',
      projectId: project.id,
      channelId: channel.id,
    });
  } catch (error) {
    console.error("Error initializing chat data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}