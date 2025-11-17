import { RoleName, ScrumRole, UserStoryStatus } from "@prisma/client";

export interface User {
  id: string;
  name?: string | null;
  email: string;
  role: RoleName;
}

export interface ProjectUser {
  id: string;
  user: User;
  userId: string;
  projectId: string;
  role: ScrumRole;
}

export interface UserStory {
  id: string;
  title: string;
  description?: string | null;
  priority: number;
  status: UserStoryStatus;
  projectId: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  startDate: string;
  endDate: string;
  users: ProjectUser[];
  stories: UserStory[];
}
