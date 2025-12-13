export enum AssignmentType {
  REGULAR = 'regular',
  SPECIAL = 'special',
  HOLIDAY = 'holiday'
}

export interface Assignment {
  date: string; // Formato ISO: YYYY-MM-DD
  personId?: string;
  personName?: string;
  type?: AssignmentType;
  dayType: 'day1' | 'day2';
  notes?: string;
  isReplacement: boolean;
  replacementReason?: string;
  originalPersonId?: string;
}

export type AssignmentMap = Map<string, Assignment>;