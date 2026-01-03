import { getFirstTimer } from '@/lib/db';
import StatusActions from '@/components/StatusActions';
import Link from 'next/link';
import { ChevronLeft, MapPin, Calendar, Phone, MessageSquare, User } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function FirstTimerDetailPage({ params }: { params: { id: string } }) {
  const firstTimer = await getFirstTimer(params.id);

  if (!firstTimer) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link href="/first-timers" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        <ChevronLeft size={16} /> Back to Directory
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info Card */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-8 rounded-2xl relative overflow-hidden bg-card">
            <div className="flex items-start justify-between mb-10 relative">
              <div className="flex gap-6 items-center">
                <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center text-3xl font-bold text-primary-foreground shadow-2xl shadow-primary/20">
                  {firstTimer.firstName[0]}{firstTimer.lastName[0]}
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">{firstTimer.firstName} {firstTimer.lastName}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground mt-1 text-sm font-medium">
                    <Calendar size={14} />
                    <span>First visit: {firstTimer.visitDate}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative">
              <div className="space-y-6">
                <div>
                  <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Contact Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-foreground font-medium">
                      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground">
                        <Phone size={16} />
                      </div>
                      <span className="text-lg">{firstTimer.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground text-sm">
                      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground">
                        <MapPin size={16} />
                      </div>
                      <span>{firstTimer.address || 'No address provided'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Prayer Request</h3>
                  <div className="p-5 bg-secondary/50 rounded-2xl text-foreground font-medium border border-border italic text-sm leading-relaxed">
                    {firstTimer.prayerRequest ? `"${firstTimer.prayerRequest}"` : "None recorded."}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Staff Notes</h3>
                  <div className="p-5 bg-secondary/30 rounded-2xl text-muted-foreground border border-dashed border-border text-sm leading-relaxed">
                    {firstTimer.notes || 'No additional notes provided for this guest.'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Status / Actions */}
        <div className="space-y-8">
          <div className="glass-card p-6 rounded-2xl bg-card">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">Integration Progress</h2>
            <div className="relative pt-2">
               <div className="flex items-center justify-between mb-4">
                 <span className="text-2xl font-black text-primary">{firstTimer.status}</span>
                 <div className="px-2 py-1 rounded bg-secondary text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Current Status</div>
               </div>
               
               <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden mb-8">
                  <div 
                    className="h-full bg-primary transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(var(--primary),0.5)]" 
                    style={{ 
                      width: firstTimer.status === 'New' ? '25%' : 
                             firstTimer.status === 'Contacted' ? '50%' :
                             firstTimer.status === 'Visited' ? '75%' : '100%' 
                    }}
                  ></div>
               </div>

              <StatusActions id={firstTimer.id} currentStatus={firstTimer.status} />
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl bg-card">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">Engagement Tools</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-bold shadow-lg shadow-primary/20">
                <Phone size={24} />
                <span className="text-xs">Call Guest</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border border-border hover:bg-secondary text-foreground transition-all font-bold">
                <MessageSquare size={24} />
                <span className="text-xs">Send Message</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
