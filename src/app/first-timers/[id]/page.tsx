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
import { FollowUpType } from '@/types';

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

             <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-2xl hover:bg-secondary transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                    <Phone size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Phone</p>
                    <p className="font-semibold text-foreground">{person.phone}</p>
                  </div>
                  <a href={`tel:${person.phone}`} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                    Call
                  </a>
                </div>

                {person.address && (
                  <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-2xl">
                    <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-muted-foreground">
                      <MapPin size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Address</p>
                      <p className="font-semibold text-foreground">{person.address}</p>
                    </div>
                  </div>
                )}
             </div>
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
