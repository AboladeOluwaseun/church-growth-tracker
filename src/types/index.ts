export type Role = 'ADMIN' | 'MEMBER';

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  role: Role;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface FirstTimer {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  address?: string | null;
  visitDate: string; // ISO date string
  prayerRequest?: string | null;
  status: 'New' | 'Contacted' | 'Visited' | 'Integrated';
  notes?: string | null;
  assignedToId?: string | null;
  assignedTo?: User | null;
}

export interface FollowUp {
  id: string;
  userId: string;
  user?: User;
  firstTimerId: string;
  firstTimer?: FirstTimer;
  notes?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Stats {
  totalFirstTimers: number;
  newThisWeek: number;
  pendingFollowUps: number;
  retentionRate: number;
}
