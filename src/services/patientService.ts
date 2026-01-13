// src/services/doctorService.ts
import { Patient, DashboardStats } from '../types/dashboard';

const MOCK_STATS: DashboardStats = {
  totalInQueue: 12,
  completedToday: 8,
  weekConsultations: 45,
  avgWaitTime: "15 min"
};

const MOCK_PATIENTS: Patient[] = [
  { 
    id: 'PT001', // Changed to unique string ID
    name: 'Zain Ahmed', 
    age: 29, 
    condition: 'Flu Symptoms', 
    status: 'Urgent', 
    arrivalTime: '10:30 AM',
    vitals: { bp: "120/80", temp: "101F", weight: "70kg" },
    receptionNotes: "Patient has high fever and body aches for 2 days."
  },
  { 
    id: 'PT002', 
    name: 'Sara Khan', 
    age: 34, 
    condition: 'Routine Checkup', 
    status: 'Normal', 
    arrivalTime: '10:45 AM',
    vitals: { bp: "110/70", temp: "98.6F", weight: "62kg" },
    receptionNotes: "Annual physical exam."
  },
  { 
    id: 'PT003', 
    name: 'Omar Ali', 
    age: 52, 
    condition: 'Blood Pressure', 
    status: 'Normal', 
    arrivalTime: '11:00 AM',
    vitals: { bp: "150/95", temp: "98.4F", weight: "85kg" },
    receptionNotes: "Patient forgot medication, feeling dizzy."
  },
];

// 1. Existing function for the main dashboard
export const getDoctorDashboard = async () => {
  await new Promise(resolve => setTimeout(resolve, 800)); 
  return {
    stats: MOCK_STATS,
    queue: MOCK_PATIENTS
  };
};

// 2. NEW FUNCTION: Get a single patient report by ID
export const getPatientReport = async (patientId: string) => {
  await new Promise(resolve => setTimeout(resolve, 500)); 
  // Find the patient in our mock list
  const patient = MOCK_PATIENTS.find(p => p.id === patientId);
  return patient || null;
};