import { getFirstTimer } from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  Calendar, 
  Phone, 
  MoreVertical,
} from 'lucide-react';
import FollowUpLog from '@/components/FollowUpLog';
import EngagementTracker from '@/components/EngagementTracker'; // New

export default async function FirstTimerDetailPage({ params }: { params: { id: string } }) {
  const person = await getFirstTimer(params.id);

  if (!person) {
    notFound();
  }

  // const progress = ['New', 'Contacted', 'Visited', 'Integrated']; // Removed
  // const currentStep = progress.indexOf(person.status); // Removed

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-10">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link 
            href="/" 
            className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
          >
            <ArrowLeft size={20} className="text-muted-foreground" />
          </Link>
          <div className="flex items-center gap-2">
            {person.isHandedOver && (
              <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-500 text-[10px] font-bold uppercase tracking-wider rounded-full border border-indigo-500/20">
                Family Unit Member
              </span>
            )}
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-secondary transition-colors">
              <MoreVertical size={20} className="text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Profile Card */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 p-6 opacity-5">
             <User size={120} />
           </div>
           
           <div className="relative z-10">
             <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-foreground">
                    {person.firstName} {person.lastName}
                  </h1>
                  <div className="flex items-center gap-2 text-muted-foreground mt-1 text-sm font-medium">
                    <Calendar size={14} />
                    <span>Visited {new Date(person.visitDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                  person.status === 'New' ? 'bg-blue-500 text-white shadow-blue-500/20' :
                  person.status === 'Contacted' ? 'bg-amber-500 text-white shadow-amber-500/20' :
                  person.status === 'Visited' ? 'bg-purple-500 text-white shadow-purple-500/20' :
                  'bg-emerald-500 text-white shadow-emerald-500/20'
                }`}>
                  <User size={24} strokeWidth={2.5} />
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-border pb-2">Personal & Contact</h3>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                      <Phone size={14} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Phone</p>
                      <p className="text-sm font-semibold">{person.phone}</p>
                    </div>
                  </div>

                  {person.email && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                        <User size={14} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Email</p>
                        <p className="text-sm font-semibold">{person.email}</p>
                      </div>
                    </div>
                  )}

                  {person.address && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                        <MapPin size={14} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">House Address</p>
                        <p className="text-sm font-semibold">{person.address}</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    {person.sex && (
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Sex</p>
                        <p className="text-sm font-semibold">{person.sex}</p>
                      </div>
                    )}
                    {person.dob && (
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">DOB</p>
                        <p className="text-sm font-semibold">
                          {(() => {
                            const [m, d] = person.dob.split('-');
                            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                            return `${months[parseInt(m) - 1]} ${d}`;
                          })()}
                        </p>
                      </div>
                    )}
                  </div>

                  {person.occupation && (
                    <div className="pt-2">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Occupation</p>
                      <p className="text-sm font-semibold">{person.occupation}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-border pb-2">Additional Details</h3>

                  {person.preferredVisitTime && (
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Preferred Visit</p>
                      <p className="text-sm font-semibold">{person.preferredVisitTime}</p>
                    </div>
                  )}

                  {person.discoverySource && (
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Source</p>
                      <p className="text-sm font-semibold">{person.discoverySource}</p>
                    </div>
                  )}

                  {person.serviceComment && (
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Service Comment</p>
                      <p className="text-xs text-muted-foreground italic leading-relaxed">&quot;{person.serviceComment}&quot;</p>
                    </div>
                  )}
                </div>
             </div>

             {person.prayerRequest && (
               <div className="mt-8 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                 <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Prayer Request</p>
                 <p className="text-sm font-medium text-foreground leading-relaxed">{person.prayerRequest}</p>
               </div>
             )}
           </div>
        </div>

        {/* Integration Actions */}
        {/* <StatusActions person={person} /> */} {/* Removed */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Weekly Engagement Tracker */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm h-fit">
            <EngagementTracker 
              firstTimerId={person.id} 
              initialAttendances={person.attendances} 
              initialFollowUps={person.followUps}
              isHandedOver={person.isHandedOver}
              visitDate={person.visitDate}
            />
          </div>

          {/* Follow Up Log */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm h-fit">
             <FollowUpLog firstTimerId={person.id} initialLogs={person.followUps} />
          </div>
        </div>

      </div>
    </div>
  );
}
