
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * @swagger
 * /api/sprints/{sprintId}:
 *   put:
 *     summary: Updates a sprint
 *     description: Updates a sprint with the provided name, start date, and end date.
 *     parameters:
 *       - in: path
 *         name: sprintId
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
 *               name:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       '200':
 *         description: Sprint updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sprint'
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
export async function PUT(req: NextRequest, { params }: { params: { sprintId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const body = await req.json();
    const { name, startDate, endDate } = body;
    const updatedSprint = await prisma.sprint.update({
      where: { id: params.sprintId },
      data: { name, startDate: new Date(startDate), endDate: new Date(endDate) },
    });
    return NextResponse.json(updatedSprint);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

/**
 * @swagger
 * /api/sprints/{sprintId}:
 *   delete:
 *     summary: Deletes a sprint
 *     description: Deletes a sprint with the provided ID.
 *     parameters:
 *       - in: path
 *         name: sprintId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Sprint deleted successfully
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
export async function DELETE(req: NextRequest, { params }: { params: { sprintId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    // Unassign stories from this sprint before deleting
    await prisma.userStory.updateMany({
      where: { sprintId: params.sprintId },
      data: { sprintId: null },
    });

    await prisma.sprint.delete({ where: { id: params.sprintId } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
