"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  FileText, 
  ChevronRight,
  Sun,
  Moon
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const menuItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "First Timers", href: "/first-timers", icon: Users },
  { name: "New Registration", href: "/first-timers/new", icon: UserPlus },
  { name: "Reports", href: "/reports", icon: FileText },
];

export default function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (val: boolean) => void }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <aside className={`
      fixed left-0 top-0 h-screen w-72 lg:w-64 bg-[#1e1b4b] text-slate-300 flex flex-col z-[60] transition-transform duration-300 ease-in-out
      lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}
    `}>
      {/* Logo Section */}
      <div className="p-6 flex items-center justify-between border-b border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <span className="text-xl font-bold">F</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white leading-tight">FEEDING</h2>
            <p className="text-[10px] text-slate-400 font-medium tracking-[0.2em] uppercase">Centre</p>
          </div>
        </div>
        
        {/* Mobile Close Button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="lg:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ChevronRight className="rotate-180" size={24} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`
                flex items-center justify-between group px-4 py-3 rounded-xl transition-all duration-200
                ${isActive 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                  : "hover:bg-slate-800/50 hover:text-white"}
              `}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} className={isActive ? "text-white" : "text-slate-400 group-hover:text-white"} />
                <span className="font-medium text-sm">{item.name}</span>
              </div>
              {isActive && <ChevronRight size={16} />}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Theme Toggle */}
      <div className="p-4 border-t border-slate-800/50 space-y-4">
        <button 
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800/50 transition-colors text-sm font-medium"
        >
          {mounted && (
            <>
              {theme === "dark" ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-indigo-400" />}
              <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            </>
          )}
        </button>

        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden border border-slate-600">
            <div className="w-full h-full bg-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-400">
              PA
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">Pastor Admin</p>
            <p className="text-[10px] text-slate-500 truncate">feedingcentre.org</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
