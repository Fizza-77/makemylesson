export type AccountPlanTier =
  | "free"
  | "individualMonthly"
  | "individualAnnual"
  | "creditTopUp50"
  | "department"
  | "school"
  | "school_plus";

export const MINIMUM_PROFILE_AGE = 16;

export function ageFromDateOfBirth(dob: Date): number {
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const hadBirthday =
    now.getMonth() > dob.getMonth() ||
    (now.getMonth() === dob.getMonth() && now.getDate() >= dob.getDate());
  if (!hadBirthday) age -= 1;
  return age;
}


