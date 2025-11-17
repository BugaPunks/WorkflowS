# WorkflowS: Agile Project Management Platform

Welcome to WorkflowS, a web platform designed for agile management of academic projects, leveraging the Scrum framework.

## Getting Started

Follow these instructions to set up and run the project locally.

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/)

### 2. Clone the Repository

```bash
git clone <repository-url>
cd WorkflowS/workflows
```

### 3. Install Dependencies

Install all the necessary packages using npm.

```bash
npm install
```

### 4. Set Up Environment Variables

The project requires environment variables to run. Copy the example file to a new `.env` file.

```bash
cp .env.example .env
```

Now, open the `.env` file and add a `NEXTAUTH_SECRET`. You can generate one with the following command:
```bash
openssl rand -hex 32
```
Paste the generated secret into your `.env` file.

### 5. Set Up the Database

This is a critical step. You need to apply the database schema to your local SQLite database. Prisma will create the `dev.db` file and run all migrations.

```bash
npx prisma migrate dev
```

This command will:
- Create the SQLite database file in `prisma/dev.db`.
- Apply all existing migrations to create the `User`, `Project`, `Sprint`, `Task`, and other tables.
- Generate the Prisma Client based on your schema.

### 6. Run the Development Server

Once the database is set up, you can start the development server.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

---

## Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Creates a production-ready build of the application.
- `npm run start`: Starts the production server (requires a build first).
- `npx prisma studio`: Opens a web UI to view and edit the data in your database.
