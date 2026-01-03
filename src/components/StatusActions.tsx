"use client";

import { useState } from 'react';
import { updateStatus } from '@/app/actions';
import { Phone, Check, UserCheck, Loader2 } from 'lucide-react';
import { FirstTimer } from '@/types';

export default function StatusActions({ id, currentStatus }: { id: string, currentStatus: FirstTimer['status'] }) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpdate = async (status: FirstTimer['status']) => {
    setLoading(status);
    await updateStatus(id, status);
    setLoading(null);
  };

  return (
    <div className="grid grid-cols-1 gap-3">
      <ActionButton 
        label="Mark as Contacted" 
        icon={<Phone size={16} />} 
        active={currentStatus === 'Contacted'} 
        onClick={() => handleUpdate('Contacted')}
        loading={loading === 'Contacted'}
        variant="violet"
      />
      <ActionButton 
        label="Mark as Visited" 
        icon={<UserCheck size={16} />} 
        active={currentStatus === 'Visited'} 
        onClick={() => handleUpdate('Visited')}
        loading={loading === 'Visited'}
        variant="emerald"
      />
      <ActionButton 
        label="Confirm Integration" 
        icon={<Check size={16} />} 
        active={currentStatus === 'Integrated'} 
        onClick={() => handleUpdate('Integrated')}
        loading={loading === 'Integrated'}
        variant="indigo"
      />
    </div>
  );
}

interface ActionButtonProps {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  loading: boolean;
  variant: 'violet' | 'emerald' | 'indigo';
}

function ActionButton({ label, icon, active, onClick, loading, variant }: ActionButtonProps) {
  const variants: Record<ActionButtonProps['variant'], string> = {
    violet: 'hover:border-violet-500/50 hover:bg-violet-500/5 text-violet-600 dark:text-violet-400',
    emerald: 'hover:border-emerald-500/50 hover:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400',
    indigo: 'hover:border-indigo-500/50 hover:bg-indigo-500/5 text-indigo-600 dark:text-indigo-400',
  };

  return (
    <button 
      onClick={onClick}
      disabled={loading || active}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-bold transition-all
        ${active 
          ? 'bg-secondary border-border opacity-50 cursor-default text-muted-foreground' 
          : 'bg-card border-border ' + variants[variant]}
        ${loading ? 'opacity-70' : ''}
      `}
    >
      {loading ? <Loader2 className="animate-spin" size={16} /> : icon}
      <span className="flex-1 text-left">{label}</span>
      {active && <Check size={14} className="opacity-50" />}
    </button>
  );
}
