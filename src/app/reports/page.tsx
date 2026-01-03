import { getWeeklyReportData } from "@/lib/db";
import { ChevronRight, FileDown, Printer, Share2, Heart, Users, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";

export default async function ReportsPage() {
  const data = await getWeeklyReportData();
  const dateRange = {
    start: new Date(new Date().setDate(new Date().getDate() - 7)).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    end: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Report Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Weekly Growth Report</h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-bold uppercase tracking-widest">Active Week</span>
            {dateRange.start} — {dateRange.end}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-3 rounded-xl border border-border bg-card hover:bg-secondary transition-all text-muted-foreground active:scale-95">
            <Printer size={20} />
          </button>
          <button className="p-3 rounded-xl border border-border bg-card hover:bg-secondary transition-all text-muted-foreground active:scale-95">
            <Share2 size={20} />
          </button>
          <button className="btn-primary flex items-center gap-3 h-12 px-6 rounded-xl hover:scale-[1.02]">
            <FileDown size={20} />
            <span className="text-sm font-bold uppercase tracking-widest">Export PDF</span>
          </button>
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
                  className="flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      {guest.firstName[0]}{guest.lastName[0]}
                    </div>
                    <div>
                      <p className="font-bold text-sm group-hover:text-primary transition-colors">{guest.firstName} {guest.lastName}</p>
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{guest.visitDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      guest.status === 'Integrated' ? 'bg-indigo-500/10 text-indigo-500' : 
                      guest.status === 'Visited' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-secondary text-muted-foreground'
                    }`}>
                      {guest.status}
                    </span>
                    <ChevronRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
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
            <div className="p-6 space-y-6 max-h-[600px] overflow-y-auto custom-scrollbar">
              {data.prayerRequests.map((req, i) => (
                <div key={i} className="space-y-2 border-b border-border last:border-0 pb-6 last:pb-0">
                  <p className="text-xs font-bold text-primary uppercase tracking-widest">{req.name}</p>
                  <p className="text-sm font-medium leading-relaxed italic text-foreground/80">"{req.request}"</p>
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

function ReportMetric({ label, value, icon, color }: any) {
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
