# Task Management Application

A modern, full-stack task management application built with Next.js 15, TypeScript, Prisma, and PostgreSQL.

## 🚀 Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL via Docker
- **ORM**: Prisma
- **UI**: Shadcn UI + Tailwind CSS
- **Package Manager**: pnpm

## 📁 Project Structure

```
app/
  ├── (dashboard)/        # Route group for dashboard
  │   └── tasks/         # Tasks pages
  ├── layout.tsx
  └── page.tsx           # Homepage

lib/
  ├── actions/           # Server actions
  ├── services/          # Business logic
  ├── db/               # Prisma client & utilities
  ├── validations/      # Zod schemas
  ├── types.ts          # TypeScript types
  ├── utils.ts          # Utility functions
  └── constants.ts      # Application constants

components/
  ├── ui/               # Shadcn UI components
  └── features/         # Feature-specific components

prisma/
  └── schema.prisma     # Database schema
```

## 🏗️ Architecture

- **Server Components**: Default for all components
- **Server Actions**: For mutations (no API routes)
- **Client Components**: Only for forms and interactivity
- **Flow**: Components → Server Actions → Services → Database

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/taskmanagement?schema=public"
NODE_ENV="development"
```

### 3. Start PostgreSQL Database

```bash
pnpm docker:up
```

This will start a PostgreSQL container using Docker Compose.

### 4. Initialize Database

```bash
# Generate Prisma Client
pnpm db:generate

# Push schema to database
pnpm db:push
```

### 5. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm db:generate` - Generate Prisma Client
- `pnpm db:push` - Push schema to database
- `pnpm db:migrate` - Run database migrations
- `pnpm db:studio` - Open Prisma Studio
- `pnpm docker:up` - Start Docker containers
- `pnpm docker:down` - Stop Docker containers

## 🎨 Adding Shadcn UI Components

To add new UI components from Shadcn:

```bash
pnpm dlx shadcn@latest add [component-name]
```

Example:
```bash
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add input
```

## 📐 Code Standards

### Naming Conventions

- **Components/Types**: PascalCase (`TaskForm`, `Task`, `CreateTaskInput`)
- **Functions/Variables**: camelCase (`createTask`, `taskService`, `userId`)
- **Files**: kebab-case (`task-form.tsx`, `task-service.ts`, `task-actions.ts`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_TITLE_LENGTH`, `DATABASE_URL`)
- **Prisma Models**: PascalCase (`Task`, `Comment`)
- **Prisma Fields**: camelCase (`createdAt`, `assigneeName`)

### Best Practices

- TypeScript strict mode enabled, no `any` types
- Use `'use server'` directive for Server Actions
- Use `'use client'` only when necessary
- Always use try-catch in Server Actions
- Return typed responses: `{ success: boolean, data?: T, error?: string }`
- No hardcoded values - use constants or env vars

## 🔧 Development

### Database Management

View your database using Prisma Studio:

```bash
pnpm db:studio
```

Stop the PostgreSQL container:

```bash
pnpm docker:down
```

### Type Safety

The project uses TypeScript in strict mode. All types are defined in:
- `lib/types.ts` - Common application types
- Prisma generates types automatically from your schema

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Shadcn UI Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 📄 License

MIT