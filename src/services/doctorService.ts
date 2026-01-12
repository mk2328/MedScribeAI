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
    id: 'PT001', 
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
  // Added more mock patients to test the "View All" scrolling
  { 
    id: 'PT004', 
    name: 'Fatima Noor', 
    age: 41, 
    condition: 'Migraine', 
    status: 'Normal', 
    arrivalTime: '11:15 AM',
    vitals: { bp: "118/75", temp: "98.8F", weight: "58kg" },
    receptionNotes: "Chronic migraine for the last 3 days."
  },
  { 
    id: 'PT005', 
    name: 'Hamza Malik', 
    age: 12, 
    condition: 'Allergy', 
    status: 'Urgent', 
    arrivalTime: '11:30 AM',
    vitals: { bp: "105/65", temp: "99.1F", weight: "35kg" },
    receptionNotes: "Sudden skin rash after lunch."
  },
];

// 1. Existing function for the main dashboard (returns stats + limited queue)
export const getDoctorDashboard = async () => {
  await new Promise(resolve => setTimeout(resolve, 800)); 
  return {
    stats: MOCK_STATS,
    queue: MOCK_PATIENTS.slice(0, 3) // Only shows top 3 on dashboard
  };
};

// 2. NEW FUNCTION: Get the full patient queue for the "View All" page
export const getFullQueue = async () => {
  await new Promise(resolve => setTimeout(resolve, 500)); 
  return MOCK_PATIENTS; // Returns the whole list
};

// 3. Existing function: Get a single patient report by ID
export const getPatientReport = async (patientId: string) => {
  await new Promise(resolve => setTimeout(resolve, 500)); 
  const patient = MOCK_PATIENTS.find(p => p.id === patientId);
  return patient || null;
};