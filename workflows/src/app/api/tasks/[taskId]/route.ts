
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * @swagger
 * /api/tasks/{taskId}:
 *   put:
 *     summary: Updates a task
 *     description: Updates a task with the provided title, description, story points, status, and assignee.
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       '200':
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
export async function PUT(req: NextRequest, { params }: { params: { taskId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const body = await req.json();
    const { title, description, storyPoints, status, assignedToId } = body;

    const updatedTask = await prisma.task.update({
      where: { id: params.taskId },
      data: {
        title,
        description,
        storyPoints,
        status,
        assignedToId,
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

/**
 * @swagger
 * /api/tasks/{taskId}:
 *   delete:
 *     summary: Deletes a task
 *     description: Deletes a task with the provided ID.
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Task deleted successfully
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
export async function DELETE(req: NextRequest, { params }: { params: { taskId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    // Delete related comments and documents first
    await prisma.comment.deleteMany({ where: { taskId: params.taskId } });
    await prisma.document.deleteMany({ where: { taskId: params.taskId } });

    await prisma.task.delete({ where: { id: params.taskId } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
