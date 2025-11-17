import NextAuth, { DefaultSession } from "next-auth";
import { RoleName } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: RoleName;
    } & DefaultSession["user"];
  }

  interface User {
    role: RoleName;
  }
}
