"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, LayoutDashboard, CheckSquare, Target } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/app", icon: LayoutDashboard },
  { name: "Tarefas", href: "/app/tasks", icon: CheckSquare },
  { name: "Calendário", href: "/app/calendar", icon: Calendar },
  { name: "Hábitos", href: "/app/habits", icon: Target },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/app" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600" />
              <span className="font-bold text-xl">TimeFlow</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
