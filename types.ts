export enum Phase {
  MainSequence = 'MAIN_SEQUENCE',
  RedSupergiant = 'RED_SUPERGIANT',
  Supernova = 'SUPERNOVA',
  Remnant = 'REMNANT'
}

export enum RemnantType {
  NeutronStar = 'NEUTRON_STAR',
  BlackHole = 'BLACK_HOLE'
}

export interface SimulationState {
  phase: Phase;
  mass: number; // Solar masses
  isTeacherMode: boolean;
  isPlaying: boolean;
  explanation: string;
  loadingAI: boolean;
}

export const MASS_THRESHOLD_BLACK_HOLE = 20; // Simplified threshold for demo
export const MIN_MASS = 8;
export const MAX_MASS = 40;
