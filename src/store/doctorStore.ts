// src/store/doctorStore.ts
import { MOCK_DOCTORS } from '../services/mockData';

// Isko hum simple state management ki tarah use karenge
let doctorsList = [...MOCK_DOCTORS];

export const getDoctors = () => doctorsList;

export const addDoctor = (newDoc: any) => {
  doctorsList = [newDoc, ...doctorsList];
  return doctorsList;
};