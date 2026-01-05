import { getWeeklyReportData } from "@/lib/db";
import { ChevronRight, FileDown, Printer, Share2, Heart, Users, CheckCircle2, Clock, ShieldCheck, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "@/lib/auth";

export default async function ReportsPage() {
  const session = await getServerSession();
  const isAdmin = session?.role === 'ADMIN';
  
  const data = await getWeeklyReportData(isAdmin ? undefined : session?.userId);
  const dateRange = {
    start: new Date(new Date().setDate(new Date().getDate() - 7)).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    end: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Report Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2 flex items-center gap-2 sm:gap-3">
              {isAdmin ? <ShieldCheck className="text-primary flex-shrink-0" size={24} /> : <LayoutDashboard className="text-primary flex-shrink-0" size={24} />}
              <span className="truncate">
                {isAdmin ? (
                  <>
                    <span className="hidden sm:inline">Church Growth Report</span>
                    <span className="sm:hidden">Growth Report</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">Personal Performance Report</span>
                    <span className="sm:hidden">My Report</span>
                  </>
                )}
              </span>
            </h1>
            <p className="text-muted-foreground font-medium flex flex-wrap items-center gap-2 text-sm">
              <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-bold uppercase tracking-widest whitespace-nowrap">
                {isAdmin ? 'Church-wide' : 'Personal'}
              </span>
              <span className="text-xs sm:text-sm">{dateRange.start} — {dateRange.end}</span>
            </p>
          </div>
          
          {/* Action Buttons - Responsive */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Hide secondary buttons on mobile, show on md+ */}
            <button className="hidden md:flex p-3 rounded-xl border border-border bg-card hover:bg-secondary transition-all text-muted-foreground active:scale-95" aria-label="Print">
              <Printer size={20} />
            </button>
            <button className="hidden md:flex p-3 rounded-xl border border-border bg-card hover:bg-secondary transition-all text-muted-foreground active:scale-95" aria-label="Share">
              <Share2 size={20} />
            </button>
            <button className="btn-primary flex items-center justify-center gap-2 sm:gap-3 h-11 sm:h-12 px-4 sm:px-6 rounded-xl hover:scale-[1.02] flex-1 sm:flex-initial">
              <FileDown size={18} className="flex-shrink-0" />
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest">Export PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ReportMetric label="Total New Guests" value={data.total} icon={<Users size={20} />} color="text-blue-500" />
        <ReportMetric label="Contacted" value={data.byStatus.Contacted} icon={<Clock size={20} />} color="text-violet-500" />
        <ReportMetric label="Visited" value={data.byStatus.Visited} icon={<Heart size={20} />} color="text-emerald-500" />
        <ReportMetric label="Integrated" value={data.byStatus.Integrated} icon={<CheckCircle2 size={20} />} color="text-indigo-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Guest List Summary */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-2xl bg-card border border-border overflow-hidden">
            <div className="p-6 border-b border-border flex justify-between items-center bg-secondary/30">
              <h2 className="font-bold text-lg">Weekly Registrations</h2>
              <span className="text-xs font-bold text-muted-foreground uppercase">{data.guests.length} total</span>
            </div>
            <div className="divide-y divide-border">
              {data.guests.map((guest) => (
                <Link 
                  href={`/first-timers/${guest.id}`} 
                  key={guest.id}
                  className="flex items-center justify-between p-3 sm:p-4 hover:bg-secondary/50 transition-colors group"
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs sm:text-sm flex-shrink-0">
                      {guest.firstName[0]}{guest.lastName[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-sm group-hover:text-primary transition-colors truncate">{guest.firstName} {guest.lastName}</p>
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{guest.visitDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    <span className={`text-[9px] sm:text-[10px] font-bold uppercase px-1.5 sm:px-2 py-0.5 rounded whitespace-nowrap ${
                      guest.status === 'Integrated' ? 'bg-indigo-500/10 text-indigo-500' : 
                      guest.status === 'Visited' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-secondary text-muted-foreground'
                    }`}>
                      {guest.status}
                    </span>
                    <ChevronRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 hidden sm:block" />
                  </div>
                </Link>
              ))}
              {data.guests.length === 0 && (
                <div className="p-12 text-center text-muted-foreground italic">
                  No new registrations recorded this week.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Prayer Requests Sidebar */}
        <div className="space-y-6">
          <div className="glass-card rounded-2xl bg-card border border-border overflow-hidden shadow-xl shadow-primary/5">
            <div className="p-6 border-b border-border bg-red-500/5">
              <h2 className="font-bold text-lg flex items-center gap-3">
                <Heart size={20} className="text-red-500 fill-red-500/20" />
                Prayer Petitions
              </h2>
            </div>
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-h-[600px] overflow-y-auto custom-scrollbar">
              {data.prayerRequests.map((req: { name: string; request: string }, i: number) => (
                <div key={i} className="space-y-2 border-b border-border last:border-0 pb-4 sm:pb-6 last:pb-0">
                  <p className="text-xs font-bold text-primary uppercase tracking-widest break-words">{req.name}</p>
                  <p className="text-sm font-medium leading-relaxed italic text-foreground/80 break-words">&quot;{req.request}&quot;</p>
                </div>
              ))}
              {data.prayerRequests.length === 0 && (
                <div className="text-center text-muted-foreground text-sm italic py-8">
                  No prayer requests submitted this week.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ReportMetricProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

function ReportMetric({ label, value, icon, color }: ReportMetricProps) {
  return (
    <div className="glass-card p-6 rounded-2xl bg-card border border-border shadow-sm group hover:border-primary/50 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2.5 rounded-xl bg-secondary ${color} group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
      </div>
      <div>
        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{label}</h3>
        <p className="text-3xl font-black">{value}</p>
      </div>
    </div>
  );
}
