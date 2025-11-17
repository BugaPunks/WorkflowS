import { RoleName, ScrumRole, UserStoryStatus, TaskStatus } from "@prisma/client";

// Core Models
export interface User {
  id: string;
  name?: string | null;
  email: string;
  role: RoleName;
}

export interface Document {
  id: string;
  filename: string;
  url: string;
  filetype: string;
  version: number;
  createdAt: string;
  uploadedBy: { name: string | null };
}

export interface Comment {
  id: string;
  text: string;
  createdAt: string;
  author: { name?: string | null; };
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  storyPoints?: number | null;
  assignedTo?: User | null;
  userStory?: UserStory;
  comments?: Comment[];
}

export interface UserStory {
  id: string;
  title: string;
  description?: string | null;
  priority: number;
  status: UserStoryStatus;
  projectId: string;
  sprintId?: string | null;
  tasks?: Task[];
  project?: Project;
}

export interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  stories: UserStory[];
}

export interface Evaluation {
  id: string;
  score: number;
  feedback?: string | null;
  student: { id: string; name: string | null };
  sprint: { id: string; name: string };
}

export interface ProjectUser {
  id: string;
  user: User;
  userId: string;
  projectId: string;
  role: ScrumRole;
}

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  startDate: string;
  endDate: string;
  users: ProjectUser[];
  stories: UserStory[];
  sprints: Sprint[];
  documents: Document[];
  evaluations?: Evaluation[];
}
