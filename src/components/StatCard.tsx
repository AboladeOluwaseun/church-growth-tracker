"use client";

import { motion } from "framer-motion";

export default function StatCard({ icon, label, value, trend, color }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-2xl border ${color} bg-card text-card-foreground shadow-sm group hover:shadow-md transition-all duration-300`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl bg-background border border-border group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-secondary text-muted-foreground whitespace-nowrap">
          {trend}
        </span>
      </div>
      <div>
        <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-1">{label}</h3>
        <p className="text-3xl font-black">{value}</p>
      </div>
    </motion.div>
  );
}
