export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Task Management App</h1>
          <p className="text-lg text-muted-foreground mb-8">
            A modern task management application built with Next.js 15, Prisma, and PostgreSQL
          </p>
        </div>
      </div>
    </main>
  );
}
