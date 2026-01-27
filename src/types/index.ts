// Types and Interfaces for FM26 Analyzer

export interface PlayerAttributes {
  // Physical
  pace: number;
  acceleration: number;
  stamina: number;
  strength: number;
  balance: number;
  agility: number;
  jumping: number;
  naturalFitness: number;
  // Mental
  workRate: number;
  teamwork: number;
  aggression: number;
  bravery: number;
  decisions: number;
  composure: number;
  concentration: number;
  anticipation: number;
  vision: number;
  flair: number;
  determination: number;
  offTheBall: number;
  // Technical
  passing: number;
  crossing: number;
  dribbling: number;
  firstTouch: number;
  finishing: number;
  heading: number;
  longShots: number;
  technique: number;
  tackling: number;
  marking: number;
  positioning: number;
  // GK
  reflexes: number;
  handling: number;
  command: number;
  aerial: number;
  oneOnOne: number;
  kicking: number;
  rushing: number;
  eccentricity: number;
  communication: number;
  throwing: number;
}

export interface Player {
  id: string;
  team: string;
  teamType: 'main' | 'youth' | 'reserve' | 'loan';
  name: string;
  age: number;
  nat: string;
  positions: { primary: string[]; secondary: string[] };
  attributes: PlayerAttributes;
  scores: {
    gk: number;
    stretching: number;
    linking: number;
    dynamic: number;
    engaged: number;
    tracking: number;
    outlet: number;
  };
  fm26Scores: {
    ip: Record<string, number>;
    oop: Record<string, number>;
    gk: Record<string, number>;
  };
  mainScore: number;
  category:
    | 'elite'
    | 'titular'
    | 'rotacao'
    | 'promessa'
    | 'vender'
    | 'baixo_nivel';
  bestRole: string;
  bestIPRole: string;
  bestOOPRole: string;
}

export interface FormationSlot {
  id: string;
  role: string;
  positionKey: string[];
  x: number;
  y: number;
  methodology: keyof Player['scores'];
  ipRole?: string;
  oopRole?: string;
}

export interface HistoryEntry {
  date: string;
  count: number;
  avgScore: number;
}

export interface CSVValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
