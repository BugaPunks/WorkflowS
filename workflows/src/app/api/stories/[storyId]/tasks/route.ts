
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * @swagger
 * /api/stories/{storyId}/tasks:
 *   post:
 *     summary: Creates a new task
 *     description: Creates a new task for a user story with the provided title, description, and assignee.
 *     parameters:
 *       - in: path
 *         name: storyId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               assignedToId:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       '400':
 *         description: Bad request, title is a required field
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { storyId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, assignedToId } = body;

    if (!title) {
      return new NextResponse("Title is a required field", { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        userStoryId: params.storyId,
        assignedToId,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
