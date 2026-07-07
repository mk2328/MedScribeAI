export type PatientStatus = "IN_QUEUE" | "ACTIVE" | "DISCHARGED";

export interface Patient {
  id: string;           // internal id
  patientNo: string;    // P-2024-001
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  department: string;
  status: PatientStatus;
}
