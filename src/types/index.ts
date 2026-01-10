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
  email?: string | null;
  occupation?: string | null;
  sex?: string | null;
  dob?: string | null;
  preferredVisitTime?: string | null;
  isBornAgain?: string | null;
  isHolyGhostBaptized?: string | null;
  discoverySource?: string | null;
  serviceComment?: string | null;
  visitDate: string; // ISO date string
  prayerRequest?: string | null;
  status: 'New' | 'Contacted' | 'Visited' | 'Integrated';
  isHandedOver: boolean;
  assignedToId?: string | null;
  assignedTo?: User | null;
  attendances?: Attendance[];
  followUps?: FollowUp[];
}

export type FollowUpType = 'CALL' | 'NOTE' | 'VISIT' | 'TEXT';

export interface FollowUp {
  id: string;
  userId: string;
  user?: User;
  firstTimerId: string;
  firstTimer?: FirstTimer;
  type: FollowUpType;
  notes?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Attendance {
  id: string;
  date: Date | string;
  firstTimerId: string;
  createdAt: Date | string;
}

export interface Stats {
  totalFirstTimers: number;
  newThisWeek: number;
  pendingFollowUps: number;
  retentionRate: number;
}
