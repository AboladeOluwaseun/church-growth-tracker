"use client";

import { useEffect, useState } from 'react';
import { Phone, Calendar, User, MessageSquare, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function MyFollowUpsPage() {
  const [followUps, setFollowUps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/my-followups')
      .then(res => res.json())
      .then(data => {
        setFollowUps(data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center p-20 text-muted-foreground">
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Follow-up History</h1>
        <p className="text-muted-foreground mt-1">Review all integration activities you have performed.</p>
      </div>

      {followUps.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-muted-foreground">
            <Calendar size={32} />
          </div>
          <p className="text-muted-foreground">You haven't logged any follow-ups yet.</p>
          <Link href="/first-timers" className="btn-primary">View Assigned Guests</Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {followUps.map((fu, index) => (
            <motion.div 
              key={fu.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card p-4 rounded-xl border-border hover:border-primary/50 transition-all flex flex-col md:flex-row md:items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                {fu.firstTimer.firstName[0]}{fu.firstTimer.lastName[0]}
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold">{fu.firstTimer.firstName} {fu.firstTimer.lastName}</h3>
                  <span className="text-[10px] bg-secondary px-2 py-0.5 rounded font-bold uppercase tracking-wider text-muted-foreground">
                    Guest
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Calendar size={14} className="text-primary" />
                    {new Date(fu.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Phone size={14} className="text-emerald-500" />
                    {fu.firstTimer.phone}
                  </span>
                </div>
              </div>

              <div className="flex-1 bg-secondary/30 p-3 rounded-lg border border-border/50 text-sm italic text-muted-foreground line-clamp-2">
                <MessageSquare size={14} className="inline mr-2 opacity-50" />
                {fu.notes || 'No notes added'}
              </div>

              <Link 
                href={`/first-timers/${fu.firstTimerId}`}
                className="flex items-center gap-2 text-xs font-bold text-primary hover:underline shrink-0"
              >
                <span>View Details</span>
                <ArrowRight size={14} />
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
