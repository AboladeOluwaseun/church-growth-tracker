import Link from 'next/link';
import { Users, TrendingUp, UserPlus, PhoneCall, Calendar, ArrowUpRight } from "lucide-react";
import { getFirstTimers } from '@/lib/db';
import StatCard from '@/components/StatCard';
import GrowthChart from '@/components/GrowthChart';

export default async function Home() {
  const firstTimers = await getFirstTimers();

  // Metrics Calculation
  const total = firstTimers.length;
  const integrated = firstTimers.filter(t => t.status === 'Integrated').length;
  const retentionRate = total > 0 ? Math.round((integrated / total) * 100) : 0;
  
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const newThisWeek = firstTimers.filter(t => new Date(t.visitDate) >= oneWeekAgo).length;

  const pending = firstTimers.filter(t => t.status === 'New' || t.status === 'Contacted').length;

  const recentFirstTimers = [...firstTimers].sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime()).slice(0, 4);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Welcome Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">Monitor guest integration and church growth metrics.</p>
        </div>
        <Link href="/first-timers/new" className="btn-primary flex items-center gap-2">
          <UserPlus size={18} />
          <span>New Guest</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Users size={20} className="text-primary" />}
          label="Total First Timers"
          value={total}
          trend="+5% vs last month"
          color="bg-primary/5 border-primary/10"
        />
        <StatCard 
          icon={<UserPlus size={20} className="text-violet-500" />}
          label="Recent Visitors"
          value={newThisWeek}
          trend="New this week"
          color="bg-violet-500/5 border-violet-500/10"
        />
        <StatCard 
          icon={<PhoneCall size={20} className="text-emerald-500" />}
          label="Follow-ups"
          value={pending}
          trend="Action required"
          color="bg-emerald-500/5 border-emerald-500/10"
        />
        <StatCard 
          icon={<TrendingUp size={20} className="text-amber-500" />}
          label="Retention"
          value={`${retentionRate}%`}
          trend="Goal: 60%"
          color="bg-amber-500/5 border-amber-500/10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Chart Area */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card rounded-2xl p-6 border-border">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold flex items-center gap-2">
                <TrendingUp size={20} className="text-primary" />
                Guest Attendance Growth
              </h3>
              <select className="bg-secondary text-xs font-medium px-3 py-1.5 rounded-lg border-none focus:ring-0 cursor-pointer">
                <option>Last 6 Months</option>
                <option>Last Year</option>
              </select>
            </div>
            <GrowthChart />
          </div>
        </div>

        {/* Sidebar Tasks / Activity */}
        <div className="space-y-6">
          <section className="glass-card rounded-2xl p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold flex items-center gap-2">
                <Calendar size={18} className="text-primary" />
                Priority Tasks
              </h3>
              <Link href="/first-timers" className="text-xs text-primary hover:underline font-medium">View All</Link>
            </div>
            
            <div className="flex-1 space-y-4">
              {recentFirstTimers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-muted-foreground">
                    <Users size={24} />
                  </div>
                  <p className="text-sm text-muted-foreground">No pending follow-ups</p>
                </div>
              ) : recentFirstTimers.map((person) => (
                <Link key={person.id} href={`/first-timers/${person.id}`} className="group block">
                  <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-all border border-transparent hover:border-border group">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      {person.firstName[0]}{person.lastName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate">{person.firstName} {person.lastName}</h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5">Contact: {person.phone}</p>
                    </div>
                    <div className="p-1.5 bg-secondary rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight size={14} className="text-muted-foreground" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <Link href="/reports" className="w-full mt-6 flex py-3 bg-secondary/30 rounded-xl border border-dashed border-border text-xs font-semibold text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-all items-center justify-center gap-2">
              Generate Weekly Report
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
