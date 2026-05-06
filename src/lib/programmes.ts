export type ProgrammeMode = "full_time" | "part_time";
export type ProgrammeLevel = "ND" | "HND";

export interface Programme {
  name: string;
  college: string;
  level: ProgrammeLevel;
  mode: ProgrammeMode;
}

export const COLLEGES = [
  "College of Engineering",
  "College of Science and Technology",
  "College of Management and Administration",
] as const;

export const COLLEGE_ACCENT: Record<string, string> = {
  "College of Engineering": "hsl(var(--college-engineering))",
  "College of Science and Technology": "hsl(var(--college-science))",
  "College of Management and Administration": "hsl(var(--college-mgmt))",
  "HND Programmes": "hsl(var(--college-hnd))",
  "Part-Time Programmes": "hsl(var(--college-pt))",
};

export const PROGRAMMES: Programme[] = [
  // ND Full-Time — Engineering
  { name: "ND Electrical/Electronic Engineering Technology", college: "College of Engineering", level: "ND", mode: "full_time" },
  { name: "ND Computer Hardware Technology", college: "College of Engineering", level: "ND", mode: "full_time" },
  // ND Full-Time — Science & Technology
  { name: "ND Library and Information Science", college: "College of Science and Technology", level: "ND", mode: "full_time" },
  { name: "ND Computer Science", college: "College of Science and Technology", level: "ND", mode: "full_time" },
  { name: "ND Computer Engineering", college: "College of Science and Technology", level: "ND", mode: "full_time" },
  { name: "ND Multimedia Technology", college: "College of Science and Technology", level: "ND", mode: "full_time" },
  { name: "ND Crime Management", college: "College of Science and Technology", level: "ND", mode: "full_time" },
  // ND Full-Time — Management
  { name: "ND Accountancy", college: "College of Management and Administration", level: "ND", mode: "full_time" },
  { name: "ND Business Administration", college: "College of Management and Administration", level: "ND", mode: "full_time" },
  { name: "ND Marketing", college: "College of Management and Administration", level: "ND", mode: "full_time" },
  { name: "ND Banking and Finance", college: "College of Management and Administration", level: "ND", mode: "full_time" },
  // HND Full-Time
  { name: "HND Accountancy", college: "College of Management and Administration", level: "HND", mode: "full_time" },
  { name: "HND Networking and Cloud Computing", college: "College of Science and Technology", level: "HND", mode: "full_time" },
  { name: "HND Computer Software and Web Development", college: "College of Science and Technology", level: "HND", mode: "full_time" },
  { name: "HND Artificial Intelligence", college: "College of Science and Technology", level: "HND", mode: "full_time" },
  { name: "HND Cyber Security and Data Protection", college: "College of Science and Technology", level: "HND", mode: "full_time" },
  // ND Part-Time
  { name: "ND Accountancy", college: "College of Management and Administration", level: "ND", mode: "part_time" },
  { name: "ND Library and Information Science", college: "College of Science and Technology", level: "ND", mode: "part_time" },
  { name: "ND Multimedia Technology", college: "College of Science and Technology", level: "ND", mode: "part_time" },
  { name: "ND Electrical/Electronic Engineering", college: "College of Engineering", level: "ND", mode: "part_time" },
  { name: "ND Computer Science", college: "College of Science and Technology", level: "ND", mode: "part_time" },
];

export const NIGERIAN_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno","Cross River",
  "Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo","Jigawa","Kaduna","Kano",
  "Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun","Oyo",
  "Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara",
];

export const STAFF_UNITS = [
  "College of Engineering",
  "College of Science and Technology",
  "College of Management and Administration",
  "Registry","Bursary","Library","ICT Unit","Security Unit","Student Affairs","Others",
];

export function getProgrammes(level: ProgrammeLevel, mode: ProgrammeMode) {
  return PROGRAMMES.filter(p => p.level === level && p.mode === mode);
}

export function findProgramme(name: string, level: ProgrammeLevel, mode: ProgrammeMode) {
  return PROGRAMMES.find(p => p.name === name && p.level === level && p.mode === mode);
}

export function getCollegeColor(application_type: "student" | "staff", level?: ProgrammeLevel | null, mode?: ProgrammeMode | null, college?: string | null) {
  if (application_type === "staff") return "hsl(var(--college-engineering))";
  if (mode === "part_time") return COLLEGE_ACCENT["Part-Time Programmes"];
  if (level === "HND") return COLLEGE_ACCENT["HND Programmes"];
  return COLLEGE_ACCENT[college || ""] || "hsl(var(--accent))";
}
