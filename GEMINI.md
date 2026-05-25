# Project: Revision Tesis (AI-Powered Thesis Review System)

This project is a monorepo for a comprehensive thesis review system that leverages AI to assist in the evaluation of university thesis progress.

## Project Overview

- **Purpose:** Automate and enhance the thesis review process using AI to identify structural, content, and formatting issues.
- **Architecture:** Monorepo managed with TurboRepo and pnpm.
- **Main Components:**
  - `apps/api`: NestJS backend providing REST APIs, AI processing (via LangChain, Gemini, and OpenAI), and background tasks (via BullMQ).
  - `apps/web`: Next.js frontend (App Router) for students, reviewers, and coordinators.
  - `packages/database`: Prisma schema and database client, using PostgreSQL with `pgvector` for embeddings.
  - `packages/types`: Shared TypeScript definitions.

## Technology Stack

- **Backend:** [NestJS](https://nestjs.com/), [Prisma](https://www.prisma.io/), [BullMQ](https://docs.bullmq.io/), [LangChain](https://js.langchain.com/), [Gemini SDK](https://ai.google.dev/), [OpenAI API](https://openai.com/api/).
- **Frontend:** [Next.js 15+](https://nextjs.org/), [React 19](https://react.dev/), [Tailwind CSS 4](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/), [NextAuth.js](https://next-auth.js.org/).
- **Storage:** [MinIO](https://min.io/) (S3-compatible) for document storage.
- **Database:** [PostgreSQL](https://www.postgresql.org/) with [pgvector](https://github.com/pgvector/pgvector).
- **Infrastucture:** [Docker Compose](https://docs.docker.com/compose/) for local development services (Postgres, Redis, MinIO).

## Getting Started

### Prerequisites
- Node.js >= 20.0.0
- pnpm 9+
- Docker & Docker Compose

### Local Development Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Start infrastructure services:**
   ```bash
   docker-compose up -d
   ```

3. **Configure environment variables:**
   - Copy `.env.example` (if exists) to `.env` in the root and check `.env` files in `apps/api` and `packages/database`.
   - Ensure `DATABASE_URL` points to the Dockerized Postgres instance (usually port 5433 per `docker-compose.yml`).

4. **Initialize Database:**
   ```bash
   cd packages/database
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Run the project in development mode:**
   ```bash
   pnpm dev
   ```

## Development Commands

- `pnpm dev`: Run all applications in development mode using TurboRepo.
- `pnpm build`: Build all applications and packages.
- `pnpm lint`: Run linting across the monorepo.
- `pnpm format`: Format code using Prettier.

### API Specifics (`apps/api`)
- `pnpm test`: Run unit tests.
- `pnpm test:e2e`: Run end-to-end tests.
- `pnpm start:debug`: Start API in debug mode.

## Architecture & Conventions

### Backend (`apps/api`)
- **Modules:** Follow standard NestJS modular architecture.
- **AI Analysis:** The `AIModule` (`src/ai`) handles document analysis. `AnalysisProcessor` (`analysis.processor.ts`) uses BullMQ to process tasks asynchronously.
- **Multimodal Analysis:** Uses Gemini's multimodal capabilities to analyze PDF/DOCX buffers directly.
- **Prisma:** Centralized `PrismaService` for database interactions.

### Frontend (`apps/web`)
- **App Router:** Uses the Next.js App Router (`app/` directory).
- **Styling:** Tailwind CSS 4 with Shadcn UI components.
- **Auth:** NextAuth.js v5 (Beta) for session management.
- **Components:** Organized by domain in `components/` (e.g., `projects`, `review`, `ui`).
- **Locale:** The UI is in Spanish (`lang="es"`).

### Database (`packages/database`)
- **Schema:** Defined in `prisma/schema.prisma`.
- **Vector Search:** Uses `pgvector` for semantic similarity in the `DocumentChunk` model.
- **Enums:** Defines `Role`, `SubmissionStatus`, `Severity`, and `FindingType`.

## Key Files & Directories
- `apps/api/src/ai/analysis.processor.ts`: Core AI analysis logic using BullMQ.
- `packages/database/prisma/schema.prisma`: Source of truth for the data model.
- `apps/web/app/layout.tsx`: Root layout with Auth and Sidebar.
- `docker-compose.yml`: Definition of local infrastructure (Postgres, Redis, MinIO).
