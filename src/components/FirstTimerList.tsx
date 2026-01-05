"use client";

import { useState } from 'react';
import { FirstTimer, FollowUp } from '@/types';
import { Search, Phone, Calendar, MapPin, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function FirstTimerList({ 
  initialData, 
  userRole, 
  userId 
}: { 
  initialData: FirstTimer[],
  userRole?: string,
  userId?: string
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'mine' | 'history'>(userRole === 'MEMBER' ? 'mine' : 'all');

  const filteredData = initialData.filter(person => {
    const matchesSearch = 
      person.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.phone.includes(searchTerm);
    
    // Default exclusions (unless searching specifically in history)
    if (filter !== 'history' && person.isHandedOver) return false;
    
    if (filter === 'mine') {
      return matchesSearch && person.assignedToId === userId;
    }
    if (filter === 'history') {
      return matchesSearch && person.isHandedOver;
    }
    return matchesSearch;
  });

  const isCallDue = (followUps: FollowUp[] = []) => {
    // ... no change
    const lastCall = followUps.find(fu => fu.type === 'CALL');
    if (!lastCall) return true;
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return new Date(lastCall.createdAt) < sevenDaysAgo;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="text" 
            placeholder="Search directory..." 
            className="input-field pl-10 h-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {(userRole === 'ADMIN' || userRole === 'MEMBER') && (
          <div className="flex bg-secondary/50 p-1 rounded-xl border border-border">
            {userRole === 'ADMIN' && (
              <button 
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'all' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Active Guests
              </button>
            )}
            <button 
              onClick={() => setFilter('mine')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'mine' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
            >
              My Assignments
            </button>
            <button 
              onClick={() => setFilter('history')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'history' ? 'bg-indigo-500 text-white shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
            >
              History
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((person) => {
          const callDue = isCallDue(person.followUps || []);
          
          return (
            <Link href={`/first-timers/${person.id}`} key={person.id} className="group">
              <div className="glass-card p-6 rounded-2xl bg-card hover:border-primary/50 transition-all duration-300 relative overflow-hidden h-full flex flex-col">
                {callDue && (
                  <div className="absolute top-0 right-0 bg-amber-500 text-white px-3 py-1 rounded-bl-xl text-[9px] font-black uppercase tracking-tighter flex items-center gap-1.5 shadow-lg shadow-amber-500/20">
                    <AlertCircle size={10} />
                    Call Due
                  </div>
                )}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      {person.firstName[0]}{person.lastName[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground leading-tight">{person.firstName} {person.lastName}</h3>
                      <StatusBadge status={person.status} />
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                
                <div className="space-y-3 mb-6 flex-1">
                  <div className="flex items-center gap-2 text-sm text-foreground font-medium">
                    <div className="w-7 h-7 rounded bg-secondary flex items-center justify-center text-muted-foreground">
                      <Phone size={14} />
                    </div>
                    <span>{person.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                     <div className="w-7 h-7 rounded bg-secondary flex items-center justify-center">
                      <MapPin size={14} />
                    </div>
                    <span className="truncate">{person.address || 'No address'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
                     <div className="w-7 h-7 rounded bg-secondary flex items-center justify-center">
                      <Calendar size={14} />
                    </div>
                    <span>Visited on {person.visitDate}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <CheckCircle2 size={10} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {person.attendances?.length || 0} / 6 Sundays
                    </span>
                  </div>
                  
                   {person.assignedTo?.name && (
                      <span className="text-[10px] text-muted-foreground font-medium bg-secondary px-2 py-0.5 rounded ml-auto mr-2">
                         By {person.assignedTo.name}
                      </span>
                   )}

                  <span className="text-[10px] font-bold text-primary group-hover:underline">View File</span>
                </div>
              </div>
            </Link>
          );
        })}
        
        {filteredData.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-muted-foreground">
              <Search size={32} />
            </div>
            <div>
              <p className="text-lg font-bold">No results found</p>
              <p className="text-sm text-muted-foreground">Try searching with a different name or phone number.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    'New': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200/50',
    'Contacted': 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-200/50',
    'Visited': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/50',
    'Integrated': 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200/50',
  };
  
  return (
    <span className={`inline-block px-2 py-0.5 mt-1 text-[10px] font-bold uppercase tracking-tighter rounded border ${colors[status] || 'bg-secondary text-muted-foreground'}`}>
      {status}
    </span>
  );
}
