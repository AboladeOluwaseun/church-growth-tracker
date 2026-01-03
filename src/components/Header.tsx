"use client";

import { Search, Bell, HelpCircle, Menu } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const date = new Date().toLocaleDateString('en-US', { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });

  const getPageTitle = () => {
    if (pathname === "/") return "Dashboard";
    if (pathname === "/first-timers") return "Directory";
    if (pathname === "/first-timers/new") return "New Guest";
    if (pathname.includes("/first-timers/")) return "Details";
    return "Dashboard";
  };

  return (
    <header className="h-16 md:h-20 bg-background/50 backdrop-blur-md border-b border-border sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-secondary rounded-lg text-muted-foreground transition-colors"
        >
          <Menu size={20} />
        </button>
        <div>
          <h2 className="text-base md:text-xl font-bold text-foreground leading-tight">{getPageTitle()}</h2>
          <p className="text-[10px] md:text-xs text-muted-foreground font-medium">{date}</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="text" 
            placeholder="Search records..." 
            className="h-10 w-64 pl-10 pr-4 rounded-full bg-secondary/50 border-none text-sm focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-background"></span>
          </button>
          <button className="p-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors">
            <HelpCircle size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
