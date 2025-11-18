import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedChatData() {
  try {
    // Crear un canal general para el proyecto
    const channel = await prisma.chatChannel.create({
      data: {
        name: 'General',
        description: 'Canal general del proyecto',
        type: 'PROJECT',
        projectId: 'test-project-id', // Cambia esto por un ID real de proyecto
        createdById: 'test-user-id', // Cambia esto por un ID real de usuario
      },
    });

    console.log('Canal creado:', channel);

    // Crear algunos mensajes de prueba
    const messages = await Promise.all([
      prisma.message.create({
        data: {
          content: '¡Bienvenidos al chat del proyecto! 🎉',
          channelId: channel.id,
          senderId: 'test-user-id',
        },
      }),
      prisma.message.create({
        data: {
          content: 'Hola a todos, ¿cómo va el progreso del sprint?',
          channelId: channel.id,
          senderId: 'test-user-id',
        },
      }),
      prisma.message.create({
        data: {
          content: 'Todo va bien, terminamos la mayoría de las tareas',
          channelId: channel.id,
          senderId: 'test-user-id',
        },
      }),
    ]);

    console.log('Mensajes creados:', messages.length);

    console.log('✅ Datos de chat sembrados exitosamente');
  } catch (error) {
    console.error('❌ Error sembrando datos de chat:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedChatData();