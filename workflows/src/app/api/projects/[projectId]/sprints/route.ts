
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * @swagger
 * /api/projects/{projectId}/sprints:
 *   get:
 *     summary: Gets all sprints for a project
 *     description: Retrieves a list of all sprints associated with a specific project.
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A list of sprints
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sprint'
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const sprints = await prisma.sprint.findMany({
      where: { projectId: params.projectId },
      orderBy: { startDate: "asc" },
      include: { stories: true },
    });
    return NextResponse.json(sprints);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

/**
 * @swagger
 * /api/projects/{projectId}/sprints:
 *   post:
 *     summary: Creates a new sprint
 *     description: Creates a new sprint for a project with the provided name, start date, and end date.
 *     parameters:
 *       - in: path
 *         name: projectId
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
 *         description: Sprint created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sprint'
 *       '400':
 *         description: Bad request, missing required fields
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, startDate, endDate } = body;

    if (!name || !startDate || !endDate) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const sprint = await prisma.sprint.create({
      data: {
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        projectId: params.projectId,
      },
    });

    return NextResponse.json(sprint);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
