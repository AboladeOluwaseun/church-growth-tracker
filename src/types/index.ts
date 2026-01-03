export interface FirstTimer {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  visitDate: string; // ISO date string
  prayerRequest?: string;
  status: 'New' | 'Contacted' | 'Visited' | 'Integrated';
  notes?: string;
}

export interface Stats {
  totalFirstTimers: number;
  newThisWeek: number;
  pendingFollowUps: number;
  retentionRate: number;
}
