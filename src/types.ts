export type MilestoneType = 'Investissement financier' | 'Lot de terrain' | 'Acquisition immobilière' | 'Autre';

export interface Milestone {
  id: string;
  title: string;
  date: string; // ISO format or just year for simplicity in this mockup
  type: MilestoneType;
  value: number;
  circumstances: string;
  imageUrl: string;
  color: string;
  year: number;
  lineWidth: number; // 1 to 10
}

export const MILESTONE_COLORS: Record<MilestoneType, string> = {
  'Investissement financier': 'var(--color-accent-blue)',
  'Lot de terrain': 'var(--color-accent-green)',
  'Acquisition immobilière': 'var(--color-accent-orange)',
  'Autre': 'var(--color-accent-purple)',
};
