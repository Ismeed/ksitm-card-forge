import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ApplicationDraft {
  application_type: "student" | "staff";
  // Personal
  first_name: string; middle_name: string; last_name: string;
  date_of_birth: string; gender: string; state_of_origin: string;
  phone: string; email: string;
  photo_data: string; // base64 data url for preview
  signature_data: string;
  // Student
  student_type: "full_time" | "part_time";
  programme_level: "ND" | "HND";
  college: string; programme: string;
  matric_number: string;
  year_of_admission: string; current_level: string; session: string;
  // Staff
  staff_id: string; department: string; designation: string;
  employment_type: string; appointment_date: string; unit: string;
  // Emergency
  emergency_contact_name: string; emergency_contact_relationship: string; emergency_contact_phone: string;
  // Wizard
  step: number;
}

const empty: ApplicationDraft = {
  application_type: "student",
  first_name: "", middle_name: "", last_name: "",
  date_of_birth: "", gender: "", state_of_origin: "",
  phone: "", email: "", photo_data: "", signature_data: "",
  student_type: "full_time", programme_level: "ND",
  college: "", programme: "", matric_number: "",
  year_of_admission: "", current_level: "ND1", session: "2024/2025",
  staff_id: "", department: "", designation: "",
  employment_type: "Full-Time", appointment_date: "", unit: "",
  emergency_contact_name: "", emergency_contact_relationship: "", emergency_contact_phone: "",
  step: 1,
};

interface Store {
  draft: ApplicationDraft;
  set: (patch: Partial<ApplicationDraft>) => void;
  reset: (type: "student" | "staff") => void;
}

export const useApplicationStore = create<Store>()(
  persist(
    (set) => ({
      draft: empty,
      set: (patch) => set((s) => ({ draft: { ...s.draft, ...patch } })),
      reset: (type) => set(() => ({ draft: { ...empty, application_type: type } })),
    }),
    { name: "ksitm-application-draft" }
  )
);
