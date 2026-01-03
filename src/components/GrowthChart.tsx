"use client";

import { motion } from "framer-motion";

export default function GrowthChart() {
  return (
    <div className="h-64 w-full overflow-x-auto overflow-y-hidden custom-scrollbar">
      <div className="h-full min-w-[500px] flex items-end justify-between gap-2 p-2 relative">
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-full h-px bg-foreground" />
          ))}
        </div>

        {/* Mock Chart Bars */}
        {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((h, i) => (
          <div key={i} className="flex-1 flex flex-col justify-end gap-2 group relative">
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ duration: 1, delay: i * 0.05, ease: "easeOut" }}
              className="w-full bg-primary/20 group-hover:bg-primary/40 rounded-t-lg transition-all duration-300 relative"
            >
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] font-bold px-2 py-1 rounded-md border border-border opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl translate-y-2 group-hover:translate-y-0">
                {h}%
              </div>
              
              <div 
                className="absolute bottom-0 left-0 w-full bg-primary/40 rounded-t-lg transition-all duration-300 opacity-50" 
                style={{ height: '30%' }} 
              />
            </motion.div>
            <span className="text-[9px] font-bold text-muted-foreground uppercase text-center truncate">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
