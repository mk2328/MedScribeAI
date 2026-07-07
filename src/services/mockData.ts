// src/services/mockData.ts

export const MOCK_ADMIN_STATS = [
  { id: 1, title: "Total Doctors", value: 3, icon: "account-group", color: "#0D9488" },
  { id: 2, title: "Total Patients", value: 1250, icon: "account-multiple", color: "#4F46E5" },
  { id: 3, title: "Active Consultations", value: 12, icon: "pulse", color: "#0891B2" },
  { id: 4, title: "Revenue", value: "450,000", icon: "cash-multiple", color: "#059669" },
];

export const MOCK_DOCTORS = [
  { 
    id: '1', 
    name: 'Sarah Ahmed', 
    username: 'sarah_cardio',
    email: 'sarah@medscribeai.com',
    phone: '+92 300 1112223',
    password: 'password123',
    specialization: 'Cardiologist', 
    experience: '12',
    availability_status: 'available',
    role: 'doctor',
    schedule: {
      "Mon": "09:00 AM - 01:00 PM",
      "Wed": "02:00 PM - 06:00 PM",
      "Fri": "09:00 AM - 12:00 PM"
    },
    created_at: new Date().toISOString()
  },
  { 
    id: '2', 
    name: 'Usman Khan', 
    username: 'usman_neuro',
    email: 'usman@medscribeai.com',
    phone: '+92 300 4445556',
    password: 'password123',
    specialization: 'Neurologist', 
    experience: '8',
    availability_status: 'available',
    role: 'doctor',
    schedule: {
      "Tue": "10:00 AM - 04:00 PM",
      "Thu": "10:00 AM - 04:00 PM"
    },
    created_at: new Date().toISOString()
  }
];

export const MOCK_USERS = [
  // Admin User
  { 
    username: 'admin',
    email: 'admin@medscribeai.com', 
    password: 'password123', 
    role: 'admin', 
    name: 'Ali Khan' 
  },
  // Mapping first doctor as a user for login
  { 
    username: 'sarah_cardio',
    email: 'sarah@medscribeai.com', 
    password: 'password123', 
    role: 'doctor', 
    name: 'Dr. Sarah Ahmed' 
  },
];