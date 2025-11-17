# WorkflowS: Agile Project Management Platform

Welcome to WorkflowS, a web platform for agile management of academic projects.

---

## Quick Start

Get the project up and running in a few commands.

### 1. Install Dependencies
Navigate into the project folder and install the required packages.
```bash
cd workflows
npm install
```

### 2. Run the Setup Script
This script will configure your environment variables and set up the database.
```bash
bash setup.sh
```
**Note:** The script will create a `.env` file from the example. You must open this file and add a `NEXTAUTH_SECRET`.

### 3. Run the Development Server
You're all set! Start the server.
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

---

## Manual Setup

If you prefer to set up the project manually, follow these steps:

1.  **Install Dependencies:** `npm install`
2.  **Environment Variables:** Copy `.env.example` to `.env` and fill in the `NEXTAUTH_SECRET`.
3.  **Database Migration:** **This is critical.** Run `npx prisma migrate dev` to create the database and its tables.
4.  **Run Server:** `npm run dev`

---

## Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Creates a production-ready build of the application.
- `npm run lint`: Lints the codebase for errors and style issues.
- `npx prisma studio`: Opens a web UI to view and edit data.
