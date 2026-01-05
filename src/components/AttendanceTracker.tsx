'use client';

import { useState } from 'react';
import { CheckCircle2, Calendar, Loader2 } from 'lucide-react';
import { Attendance } from '@/types';

export default function AttendanceTracker({ 
  firstTimerId, 
  initialAttendances = [],
  isHandedOver: initialHandedOver = false,
  visitDate
}: { 
  firstTimerId: string, 
  initialAttendances?: Attendance[],
  isHandedOver?: boolean,
  visitDate: string
}) {
  const [attendances, setAttendances] = useState<Attendance[]>(initialAttendances);
  const [loadingDate, setLoadingDate] = useState<string | null>(null);
  const [generalLoading, setGeneralLoading] = useState(false);
  const [isHandedOver, setIsHandedOver] = useState(initialHandedOver);

  // Generate Sundays starting from the visit date week
  const generateSundays = (startDateStr: string, count: number = 10) => {
    const dates = [];
    const date = new Date(startDateStr);
    
    // Adjust to the Sunday of that week (if visit was not Sunday, maybe start from next Sunday or previous? 
    // Usually start FROM the visit date if it's Sunday, or next Sunday. 
    // Let's assume we want to track from the visit week's Sunday.)
    const day = date.getDay();
    // Logic: If day is 0 (Sunday), start today. Else, add (7 - day).
    const daysUntilSunday = day === 0 ? 0 : 7 - day;
    date.setDate(date.getDate() + daysUntilSunday);

    for (let i = 0; i < count; i++) {
      dates.push(new Date(date));
      date.setDate(date.getDate() + 7);
    }
    return dates;
  };

  const sundays = generateSundays(visitDate);
  
  const count = attendances.length;
  const isComplete = count >= 6;

  const isAttended = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return attendances.some(a => new Date(a.date).toISOString().split('T')[0] === dateStr);
  };

  const toggleAttendance = async (date: Date) => {
    const dateStr = date.toISOString();
    setLoadingDate(dateStr);

    try {
      if (isAttended(date)) {
        // Unmark (Delete)
        const res = await fetch('/api/attendance', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ firstTimerId, date: dateStr }),
        });
        if (res.ok) {
           setAttendances(prev => prev.filter(a => new Date(a.date).toISOString().split('T')[0] !== date.toISOString().split('T')[0]));
        }
      } else {
        // Mark (Create)
        const res = await fetch('/api/attendance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ firstTimerId, date: dateStr }),
        });
        const data = await res.json();
        if (res.ok) {
          setAttendances([...attendances, data]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDate(null);
    }
  };

  const handleHandOver = async () => {
    setGeneralLoading(true);
    try {
      const res = await fetch('/api/handover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstTimerId }),
      });
      if (res.ok) {
        setIsHandedOver(true);
        window.location.reload(); 
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGeneralLoading(false);
    }
  };

  if (isHandedOver) {
    return (
      <div className="p-6 bg-secondary/20 border border-dashed border-border rounded-2xl text-center space-y-2">
        <div className="w-12 h-12 bg-indigo-500/10 text-indigo-500 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 size={24} />
        </div>
        <h3 className="font-bold text-indigo-500">Handed Over</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          This guest has been successfully transitioned to a family unit.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <Calendar size={16} className="text-primary" />
          Attendance Tracker
        </h3>
        <span className="px-2 py-0.5 bg-secondary rounded text-[10px] font-bold text-muted-foreground uppercase">
          {count} / 6 Sundays
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {sundays.map((sunday, i) => {
          const attended = isAttended(sunday);
          const isLoading = loadingDate === sunday.toISOString();
          
          return (
            <button
              key={i}
              onClick={() => toggleAttendance(sunday)}
              disabled={isLoading || generalLoading}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all aspect-[4/3] ${
                attended 
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 shadow-sm' 
                  : 'bg-card border-border hover:border-primary/50 text-muted-foreground hover:bg-secondary/30'
              }`}
            >
              <div className="text-[10px] uppercase font-bold tracking-wider mb-1 opacity-70">
                Wk {i + 1}
              </div>
              <div className="text-sm font-bold flex items-center gap-1.5">
                {isLoading ? <Loader2 size={14} className="animate-spin" /> : attended ? <CheckCircle2 size={14} /> : null}
                <span>{sunday.getDate()} {sunday.toLocaleDateString(undefined, { month: 'short' })}</span>
              </div>
            </button>
          );
        })}
      </div>

      {isComplete && (
        <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl space-y-3 animate-in fade-in zoom-in-95 duration-500">
          <p className="text-xs font-bold text-center text-primary uppercase tracking-widest">Target Reached!</p>
          <button 
            onClick={handleHandOver}
            disabled={generalLoading}
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            {generalLoading ? <Loader2 size={18} className="animate-spin" /> : null}
            <span>Hand Over to Family Unit</span>
          </button>
        </div>
      )}
    </div>
  );
}
