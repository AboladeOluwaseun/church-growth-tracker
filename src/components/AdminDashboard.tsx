'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, ClipboardList, Clock, CheckCircle2, AlertCircle, Search } from 'lucide-react';

import { FollowUp, User, FollowUpType } from '@/types';
import ActivityFeed from '@/components/ActivityFeed';

interface MemberActivity extends User {
  assignedItems: {
    id: string;
    firstName: string;
    lastName: string;
    status: string;
    visitDate: string;
  }[];
  followUps: (FollowUp & {
    firstTimer: {
      firstName: string;
      lastName: string;
    }
  })[];
}

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

export default function AdminDashboard() {
  const [members, setMembers] = useState<MemberActivity[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/members').then(res => res.json()),
      fetch('/api/admin/activities').then(res => res.json())
    ])
    .then(([membersData, activitiesData]) => {
        if (membersData.error) throw new Error(membersData.error);
        setMembers(membersData);
        if (!activitiesData.error) {
           setActivities(activitiesData);
        }
    })
    .catch(err => setError(err.message))
    .finally(() => setLoading(false));
  }, []);

  const filteredMembers = members.filter(m => 
    m.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center p-20 text-destructive gap-4">
      <AlertCircle size={40} />
      <p className="font-medium">{error}</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Console</h1>
          <p className="text-muted-foreground mt-1">Monitor MIU members and integration progress.</p>
        </div>
        
        <div className="relative w-full md:w-64 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search members..."
            className="input-field pl-10 h-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-6">
            {filteredMembers.length === 0 ? (
                <div className="glass-card rounded-3xl p-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-muted-foreground">
                    <Users size={32} />
                </div>
                <p className="text-muted-foreground">No members found matching your search.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                {filteredMembers.map((member, index) => (
                    <motion.div
                    key={member.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-card rounded-3xl p-6 border-border flex flex-col gap-6"
                    >
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border border-primary/20">
                            {member.name?.[0] || 'U'}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">{member.name || 'Anonymous Member'}</h3>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${member.role === 'ADMIN' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
                        {member.role === 'ADMIN' ? 'Admin' : 'MIU Member'}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-secondary/50 rounded-2xl p-4 border border-border">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <CheckCircle2 size={16} />
                            <span className="text-xs font-semibold uppercase tracking-wider">Assigned</span>
                        </div>
                        <p className="text-2xl font-black text-gradient">{member.assignedItems.length}</p>
                        </div>
                        <div className="bg-secondary/50 rounded-2xl p-4 border border-border">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <Clock size={16} />
                            <span className="text-xs font-semibold uppercase tracking-wider">Follow-ups</span>
                        </div>
                        <p className="text-2xl font-black text-gradient">{member.followUps.length}</p>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Recent Activity</h4>
                        <div className="space-y-3">
                        {member.followUps.length === 0 ? (
                            <p className="text-sm text-muted-foreground bg-secondary/30 rounded-xl p-3 text-center border border-dashed border-border italic">No recent follow-up activity</p>
                        ) : (
                            member.followUps.map((fu: FollowUp & { firstTimer: { firstName: string; lastName: string; } }) => (
                            <div key={fu.id} className="flex gap-3 items-start p-3 bg-secondary/30 rounded-xl border border-border/50 group hover:border-primary/20 transition-all">
                                <div className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0" />
                                <div>
                                <p className="text-sm font-semibold">
                                    Logged a follow-up for <span className="text-primary">{fu.firstTimer.firstName} {fu.firstTimer.lastName}</span>
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 italic">&quot;{fu.notes || 'No notes'}&quot;</p>
                                <p className="text-[10px] text-muted-foreground mt-1 font-medium italic">
                                    {new Date(fu.createdAt).toLocaleDateString()}
                                </p>
                                </div>
                            </div>
                            ))
                        )}
                        </div>
                    </div>

                    <button className="w-full mt-auto py-3 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                        <ClipboardList size={18} />
                        <span>View Full History</span>
                    </button>
                    </motion.div>
                ))}
                </div>
            )}
         </div>
         
         <div className="space-y-6">
            <ActivityFeed activities={activities} />
         </div>
      </div>
    </div>
  );
}
