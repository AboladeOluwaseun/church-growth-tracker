import Link from 'next/link';
import { Users, TrendingUp, UserPlus, Calendar, ArrowUpRight, ShieldCheck, Activity, LayoutDashboard, CheckCircle2, Phone } from "lucide-react";
import { getFirstTimers } from '@/lib/db';
import StatCard from '@/components/StatCard';
import GrowthChart from '@/components/GrowthChart';
import { getServerSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { FirstTimer } from '@/types';

export default async function Home({ searchParams }: { searchParams: { view?: string } }) {
  const session = await getServerSession();
  const isAdmin = session?.role === 'ADMIN';
  const isPersonalView = searchParams.view === 'personal';
  
  // If user is Admin but wants personal view, treat them as member for data fetching
  const showAdminDashboard = isAdmin && !isPersonalView;

  // Fetch data personalized for the user
  const activeFirstTimers = await getFirstTimers(showAdminDashboard ? undefined : (session?.userId));
  const allFirstTimers = await getFirstTimers(showAdminDashboard ? undefined : (session?.userId), true);
  
  // For Admin: Fetch some global member activity metrics
  let memberCount = 0;
  let totalFollowUps = 0;
  if (showAdminDashboard) {
    memberCount = await prisma.user.count({ where: { role: 'MEMBER' } });
    totalFollowUps = await prisma.followUp.count();
  }

  // Metrics Calculation
  const totalActive = activeFirstTimers.length;
  const integratedTotal = allFirstTimers.filter(t => t.isHandedOver).length;
  const retentionRate = allFirstTimers.length > 0 ? Math.round((integratedTotal / allFirstTimers.length) * 100) : 0;
  
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const callsDueCount = activeFirstTimers.filter(t => {
    const lastCall = t.followUps?.find(fu => fu.type === 'CALL');
    if (!lastCall) return true;
    return new Date(lastCall.createdAt) < oneWeekAgo;
  }).length;

  const recentFirstTimers = [...activeFirstTimers].sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime()).slice(0, 4);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Welcome Section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
              {showAdminDashboard ? <ShieldCheck className="text-primary flex-shrink-0" size={20} /> : <LayoutDashboard className="text-primary flex-shrink-0" size={20} />}
              <span className="truncate">
                {showAdminDashboard ? 'MIU Admin Overview' : 'My Performance Dashboard'}
              </span>
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {showAdminDashboard 
                ? 'Monitoring church-wide integration across all MIU members.' 
                : 'Track your assigned first-timers and follow-up activities.'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            {isAdmin && (
              <>
                  <Link 
                      href={showAdminDashboard ? "/?view=personal" : "/"} 
                      className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 border whitespace-nowrap ${showAdminDashboard ? 'bg-secondary text-secondary-foreground border-border' : 'bg-primary/10 text-primary border-primary/20'}`}
                  >
                      {showAdminDashboard ? <LayoutDashboard size={16} /> : <ShieldCheck size={16} />}
                      <span className="hidden sm:inline">{showAdminDashboard ? 'Switch to Personal View' : 'Switch to Admin View'}</span>
                      <span className="sm:hidden">{showAdminDashboard ? 'Personal' : 'Admin'}</span>
                  </Link>
                  <Link href="/admin" className="px-3 sm:px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-medium text-xs sm:text-sm hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2 whitespace-nowrap">
                    <Activity size={16} />
                    <span className="hidden sm:inline">Admin Console</span>
                    <span className="sm:hidden">Console</span>
                  </Link>
              </>
            )}
            <Link href="/first-timers/new" className="btn-primary flex items-center justify-center gap-2 text-sm sm:text-base whitespace-nowrap">
              <UserPlus size={16} />
              <span>New Guest</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <StatCard 
          icon={<Users size={20} className="text-blue-500" />}
          label={showAdminDashboard ? "Total First Timers" : "Total Assigned"}
          value={allFirstTimers.length}
          trend="All time"
          color="bg-blue-500/5 border-blue-500/10"
        />
        <StatCard 
          icon={<Users size={20} className="text-primary" />}
          label={showAdminDashboard ? "Active Guests" : "Currently Active"}
          value={totalActive}
          trend={showAdminDashboard ? `${memberCount} active members` : "Active follow-ups"}
          color="bg-primary/5 border-primary/10"
        />
        <StatCard 
          icon={<Phone size={20} className="text-amber-500" />}
          label="Calls Required"
          value={callsDueCount}
          trend="Need follow-up this week"
          color="bg-amber-500/5 border-amber-500/10"
        />
        <StatCard 
          icon={<CheckCircle2 size={20} className="text-emerald-500" />}
          label="Integrated"
          value={integratedTotal}
          trend={showAdminDashboard ? "Church-wide total" : "Joined Family Units"}
          color="bg-emerald-500/5 border-emerald-500/10"
        />
        <StatCard 
          icon={<TrendingUp size={20} className="text-indigo-500" />}
          label="Integration Rate"
          value={`${retentionRate}%`}
          trend={showAdminDashboard ? "Church-wide" : "My success rate"}
          color="bg-indigo-500/5 border-indigo-500/10"
        />
      </div>

      {showAdminDashboard && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Funnel Overview */}
          <div className="glass-card rounded-2xl p-6 border-border">
            <h3 className="font-bold mb-6 flex items-center gap-2">
              <Activity size={18} className="text-primary" />
              Integration Funnel
            </h3>
            <div className="space-y-4">
              {[
                { label: 'New Registrations', status: 'New', color: 'bg-blue-500' },
                { label: 'Followed Up', status: 'Contacted', color: 'bg-violet-500' },
                { label: 'Visited Again', status: 'Visited', color: 'bg-emerald-500' },
                { label: 'Fully Integrated', status: 'Integrated', color: 'bg-indigo-500' },
              ].map((step, i) => {
                const count = allFirstTimers.filter((t: FirstTimer) => t.status === step.status).length;
                const totalAll = allFirstTimers.length;
                const percentage = totalAll > 0 ? (count / totalAll) * 100 : 0;
                return (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
                      <span>{step.label}</span>
                      <span>{count} guests</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${step.color} transition-all duration-1000`} 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Quick Member Activity */}
          <div className="glass-card rounded-2xl p-6 border-border">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold flex items-center gap-2">
                <Users size={18} className="text-primary" />
                Active MIU Members
              </h3>
              <Link href="/admin" className="text-xs text-primary hover:underline font-medium">Manage Team</Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary/20 p-4 rounded-xl border border-border/50 text-center">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Members</p>
                <p className="text-2xl font-black">{memberCount}</p>
              </div>
              <div className="bg-secondary/20 p-4 rounded-xl border border-border/50 text-center">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Follow-ups</p>
                <p className="text-2xl font-black">{totalFollowUps}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-6 text-center italic">
              Use the Admin Console to view detailed member performance and assign guests.
            </p>
          </div>
        </div>
      )}

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
                {showAdminDashboard ? 'Recent Registrations' : 'My Priority Tasks'}
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
