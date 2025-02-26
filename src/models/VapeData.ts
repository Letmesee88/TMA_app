export interface VapeSession {
  id: string;
  timestamp: number;
  puffs: number;
  duration: number; // в секундах
}

export interface VapeStats {
  totalPuffs: number;
  dailyPuffs: { [date: string]: number };
  sessions: VapeSession[];
}

export const DEFAULT_VAPE_STATS: VapeStats = {
  totalPuffs: 0,
  dailyPuffs: {},
  sessions: []
};
