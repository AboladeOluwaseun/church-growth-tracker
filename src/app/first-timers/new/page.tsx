import { submitFirstTimer } from '@/app/actions';
import SubmitButton from '@/components/SubmitButton';
import Link from 'next/link';
import { ChevronLeft, UserPlus } from 'lucide-react';

export default function NewFirstTimerPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link href="/first-timers" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        <ChevronLeft size={16} /> Back to Directory
      </Link>

      <div className="glass-card p-8 rounded-2xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <UserPlus size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">New Guest Registration</h1>
            <p className="text-sm text-muted-foreground">Capture visit details from the welcome slip.</p>
          </div>
        </div>

        <form action={submitFirstTimer} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground/80">First Name</label>
              <input required name="firstName" type="text" placeholder="John" className="input-field" />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground/80">Last Name</label>
              <input required name="lastName" type="text" placeholder="Doe" className="input-field" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground/80">Phone Number</label>
              <input required name="phone" type="tel" placeholder="555-000-0000" className="input-field" />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground/80">Visit Date</label>
              <input required name="visitDate" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="input-field" />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground/80">Home Address</label>
            <input name="address" type="text" placeholder="123 Street, City" className="input-field" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground/80">Prayer Request</label>
              <textarea name="prayerRequest" rows={3} placeholder="Describe specific prayer needs..." className="input-field resize-none"></textarea>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground/80">Additional Notes</label>
              <textarea name="notes" rows={3} placeholder="Interests, family details, etc." className="input-field resize-none"></textarea>
            </div>
          </div>

          <div className="pt-4">
            <SubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
}
