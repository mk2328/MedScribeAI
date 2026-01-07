// src/types/dashboard.ts
export interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  status: 'Urgent' | 'Normal';
  arrivalTime: string;
  vitals?: {
    bp: string;
    temp: string;
    weight: string;
  };
  receptionNotes?: string;
}
export interface DashboardStats {
  totalInQueue: number;
  completedToday: number;
  weekConsultations: number;
  avgWaitTime: string;
}