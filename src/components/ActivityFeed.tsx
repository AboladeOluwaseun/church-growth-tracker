'use client';

import { useTheme } from 'next-themes';
import { Phone, Home, MessageSquare, FileText, Clock, User, CheckCircle2 } from 'lucide-react';
import { FollowUpType } from '@/types';

interface Activity {
  id: string;
  type: FollowUpType | 'ATTENDANCE';
  notes: string | null;
  createdAt: string | Date;
  user: {
    name: string | null;
  } | null;
  firstTimer: {
    firstName: string;
    lastName: string;
  };
}

export default function ActivityFeed({ activities }: { activities: Activity[] }) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'CALL': return <Phone size={14} className="text-amber-500" />;
      case 'VISIT': return <Home size={14} className="text-purple-500" />;
      case 'TEXT': return <MessageSquare size={14} className="text-blue-500" />;
      case 'ATTENDANCE': return <CheckCircle2 size={14} className="text-emerald-500" />;
      default: return <FileText size={14} className="text-zinc-500" />;
    }
  };

  return (
    <div className="glass-card rounded-2xl border border-border overflow-hidden h-fit">
      
      {/* ... header ... */}
      <div className="p-4 border-b border-border bg-secondary/30 flex justify-between items-center">
        <h3 className="font-bold flex items-center gap-2 text-sm">
          <Clock size={16} className="text-primary" />
          Live Activity Feed
        </h3>
        <span className="text-[10px] uppercase font-bold text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
            Recent Updates
        </span>
      </div>

      <div className="divide-y divide-border/50 max-h-[400px] overflow-y-auto custom-scrollbar">
        {activities.length === 0 ? (
           <div className="p-8 text-center text-muted-foreground italic text-xs">
             No recent activities recorded.
           </div>
        ) : activities.map((activity) => (
          <div key={activity.id} className="p-4 hover:bg-secondary/20 transition-colors flex gap-3 group">
            <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-border shadow-sm
                ${activity.type === 'CALL' ? 'bg-amber-500/10' : 
                  activity.type === 'VISIT' ? 'bg-purple-500/10' : 
                  activity.type === 'ATTENDANCE' ? 'bg-emerald-500/10' :
                  'bg-secondary'}`}>
              {getIcon(activity.type)}
            </div>
            
            <div className="flex-1 min-w-0">
               <div className="flex justify-between items-start">
                 <p className="text-xs font-medium truncate">
                   <span className="font-bold text-primary">{activity.user?.name || 'Member'}</span> 
                   <span className="text-muted-foreground"> 
                     {activity.type === 'CALL' ? ' called ' : 
                      activity.type === 'VISIT' ? ' visited ' : 
                      activity.type === 'TEXT' ? ' messaged ' : 
                      activity.type === 'ATTENDANCE' ? ' marked attendance for ' :
                      ' added a note for '}
                   </span>
                   <span className="font-bold text-foreground">{activity.firstTimer.firstName} {activity.firstTimer.lastName}</span>
                 </p>
                 <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                   {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                 </span>
               </div>
               
               {activity.notes && (
                 <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 italic leading-relaxed group-hover:text-foreground/80 bg-secondary/30 group-hover:bg-secondary/50 rounded-lg p-2 transition-colors border border-transparent group-hover:border-border/50">
                   &quot;{activity.notes}&quot;
                 </p>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
