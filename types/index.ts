export interface TeamMember {
  id: string;
  name: string;
  initials: string;
  color: string;
}

export interface TeamData {
  team: TeamMember[];
  rotationOrder: string[];
  config: {
    daysPerGuard: number;
    workDaysOnly: boolean;
  };
}

export interface Replacement {
  id: string;
  originalPersonId: string;
  replacementPersonId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'active' | 'inactive';
}

export interface Assignment {
  date: string;
  personId: string;
  type: 'day1' | 'day2';
  isReplacement: boolean;
  replacementReason?: string;
  originalPersonId?: string;
}

export interface DayInfo {
  date: Date;
  dayNumber: number;
  isWeekend: boolean;
  assignment?: Assignment;
  teamMember?: TeamMember;
}
