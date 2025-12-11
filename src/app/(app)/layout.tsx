import { AppNav } from "@/components/app-nav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
