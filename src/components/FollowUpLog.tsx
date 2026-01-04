'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Clock, CheckCircle2 } from 'lucide-react';

interface FollowUp {
  id: string;
  notes: string;
  createdAt: string;
  user: {
    name: string;
  };
}

export default function FollowUpLog({ firstTimerId }: { firstTimerId: string }) {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/followups?firstTimerId=${firstTimerId}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setFollowUps(data);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [firstTimerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/followups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstTimerId, notes: newNote }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to log follow-up');

      setFollowUps([data, ...followUps]);
      setNewNote('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <Clock size={16} className="text-primary" />
          Follow-up History
        </h3>
        <span className="px-2 py-0.5 bg-secondary rounded text-[10px] font-bold text-muted-foreground uppercase">
          {followUps.length} entries
        </span>
      </div>
      
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-xs font-bold animate-in fade-in slide-in-from-top-2">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="relative group">
        <textarea
          placeholder="Log a new follow-up interaction..."
          className="input-field min-h-[100px] pt-4 pr-12 resize-none bg-secondary/30 focus:bg-background"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          disabled={submitting}
        />
        <button
          type="submit"
          disabled={submitting || !newNote.trim()}
          className="absolute right-3 bottom-3 p-2 bg-primary text-primary-foreground rounded-xl flex items-center justify-center hover:bg-primary/90 transition-all disabled:opacity-50 disabled:scale-95"
        >
          {submitting ? (
            <div className="w-5 h-5 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <Send size={18} />
          )}
        </button>
      </form>

      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="h-24 bg-secondary/50 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : followUps.length === 0 ? (
          <div className="p-8 bg-secondary/20 rounded-2xl border border-dashed border-border flex flex-col items-center justify-center text-center gap-3">
            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-muted-foreground/50">
              <MessageSquare size={20} />
            </div>
            <p className="text-sm text-muted-foreground italic">No follow-ups recorded yet. Be the first to reach out!</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {followUps.map((fu) => (
              <motion.div
                key={fu.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="glass-card p-5 rounded-2xl border-border bg-card/40 relative group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                      {fu.user.name?.[0] || 'U'}
                    </div>
                    <span className="text-xs font-bold">{fu.user.name}</span>
                  </div>
                  <span className="text-[10px] font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                    {new Date(fu.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </span>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                  {fu.notes}
                </p>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <CheckCircle2 size={14} className="text-emerald-500" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
