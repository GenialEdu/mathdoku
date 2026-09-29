export type GameMode = 'math' | 'kids' | 'chemistry';

export type MathDifficulty = 'basic' | 'intermediate' | 'advanced' | 'expert';
export type PuzzleDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface DifficultySettings {
  math: MathDifficulty;
  puzzle: PuzzleDifficulty;
}

export interface MathExpression {
  display: string;
  value: number;
  difficulty: number;
}

// Shape definitions for kids mode
export type ShapeType = 'circle' | 'triangle' | 'square' | 'diamond' | 'star' | 'hexagon' | 'pentagon' | 'heart' | 'octagon';

export interface KidsShape {
  shape: ShapeType;
  color: string;
  colorName: string;
  bgColor: string;
  borderColor: string;
  value: number;
}

// Map each number 1-9 to a unique shape+color combination
export const KIDS_SHAPES: Record<number, KidsShape> = {
  1: { shape: 'circle', color: '#FBBF24', colorName: 'Amarillo', bgColor: '#FEF3C7', borderColor: '#F59E0B', value: 1 },
  2: { shape: 'triangle', color: '#EF4444', colorName: 'Rojo', bgColor: '#FEE2E2', borderColor: '#DC2626', value: 2 },
  3: { shape: 'square', color: '#3B82F6', colorName: 'Azul', bgColor: '#DBEAFE', borderColor: '#2563EB', value: 3 },
  4: { shape: 'diamond', color: '#10B981', colorName: 'Verde', bgColor: '#D1FAE5', borderColor: '#059669', value: 4 },
  5: { shape: 'star', color: '#8B5CF6', colorName: 'Violeta', bgColor: '#EDE9FE', borderColor: '#7C3AED', value: 5 },
  6: { shape: 'hexagon', color: '#F97316', colorName: 'Naranja', bgColor: '#FFEDD5', borderColor: '#EA580C', value: 6 },
  7: { shape: 'pentagon', color: '#EC4899', colorName: 'Rosa', bgColor: '#FCE7F3', borderColor: '#DB2777', value: 7 },
  8: { shape: 'heart', color: '#06B6D4', colorName: 'Cyan', bgColor: '#CFFAFE', borderColor: '#0891B2', value: 8 },
  9: { shape: 'octagon', color: '#84CC16', colorName: 'Lima', bgColor: '#ECFCCB', borderColor: '#65A30D', value: 9 },
};

export interface Cell {
  id: string;
  row: number;
  col: number;
  value: number | null;
  expression: MathExpression | null;
  isFixed: boolean;
  userAnswer: number | null;
  isCorrect: boolean | null;
  notes: number[];
}

export interface GameState {
  board: Cell[][];
  solution: number[][];
  level: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  startTime: number;
  elapsedTime: number;
  errors: number;
  hintsUsed: number;
  isComplete: boolean;
  isPaused: boolean;
  gameMode: GameMode;
}

export interface PlayerProfile {
  nickname: string;
  createdAt: number;
  preferredMode: GameMode;
}

export interface PlayerStats {
  gamesPlayed: number;
  gamesWon: number;
  totalTime: number;
  bestTime: Record<number, number>;
  totalErrors: number;
  currentStreak: number;
  bestStreak: number;
  levelsCompleted: number[];
  xp: number;
  rank: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
  requirement: () => boolean;
}

export interface DailyChallenge {
  date: string;
  level: number;
  seed: number;
  completed: boolean;
  time?: number;
}

export interface SavedGame {
  id: string;
  gameState: GameState;
  savedAt: number;
  name: string;
}

export interface HintPuzzle {
  question: string;
  answer: number;
  options: number[];
  difficulty: number;
}

export interface Settings {
  theme: 'light' | 'dark' | 'auto';
  soundEnabled: boolean;
  musicEnabled: boolean;
  vibrationEnabled: boolean;
  showTimer: boolean;
  autoCheckErrors: boolean;
  highlightSameNumbers: boolean;
  fontSize: 'small' | 'medium' | 'large';
  difficulty: DifficultySettings;
  manualDifficulty: boolean;
}

export const MAX_ERRORS = 3;

export type GameAction =
  | { type: 'SELECT_CELL'; row: number; col: number }
  | { type: 'INPUT_NUMBER'; value: number }
  | { type: 'CLEAR_CELL' }
  | { type: 'TOGGLE_NOTE'; value: number }
  | { type: 'USE_HINT' }
  | { type: 'NEW_GAME'; level: number }
  | { type: 'RESTART_GAME' }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'LOAD_GAME'; gameState: GameState }
  | { type: 'TICK' };

// Chemistry mode - Periodic table elements 1-9 (for 9x9 grid)
export interface ElementSymbol {
  symbol: string;
  atomicNumber: number;
  name: string;
  group: number;
  period: number;
}

export const CHEMISTRY_ELEMENTS: Record<number, ElementSymbol> = {
  1: { symbol: 'H',  atomicNumber: 1,  name: 'Hidrógeno',    group: 1,  period: 1 },
  2: { symbol: 'He', atomicNumber: 2,  name: 'Helio',        group: 18, period: 1 },
  3: { symbol: 'Li', atomicNumber: 3,  name: 'Litio',        group: 1,  period: 2 },
  4: { symbol: 'Be', atomicNumber: 4,  name: 'Berilio',      group: 2,  period: 2 },
  5: { symbol: 'B',  atomicNumber: 5,  name: 'Boro',         group: 13, period: 2 },
  6: { symbol: 'C',  atomicNumber: 6,  name: 'Carbono',      group: 14, period: 2 },
  7: { symbol: 'N',  atomicNumber: 7,  name: 'Nitrógeno',    group: 15, period: 2 },
  8: { symbol: 'O',  atomicNumber: 8,  name: 'Oxígeno',      group: 16, period: 2 },
  9: { symbol: 'F',  atomicNumber: 9,  name: 'Flúor',        group: 17, period: 2 },
};
