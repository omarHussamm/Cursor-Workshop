export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold">Task Management</h1>
        </div>
      </header>
      <main className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
