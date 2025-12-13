export enum ReplacementStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export interface Replacement {
  id: string;
  originalPersonId: string;
  replacementPersonId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: ReplacementStatus;
}

export type ReplacementRequest = Omit<Replacement, 'id' | 'status'>;