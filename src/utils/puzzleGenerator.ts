import { Cell, GameState, HintPuzzle, GameMode, DifficultySettings, MathDifficulty, PuzzleDifficulty } from '@/types/game';
import { generateExpression, generateChemistryExpression } from './mathExpressions';

// Fisher-Yates shuffle
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Generate a valid 9x9 Sudoku solution
function generateSolution(): number[][] {
  const grid: number[][] = Array(9).fill(null).map(() => Array(9).fill(0));
  
  function isValid(row: number, col: number, num: number): boolean {
    for (let c = 0; c < 9; c++) {
      if (grid[row][c] === num) return false;
    }
    for (let r = 0; r < 9; r++) {
      if (grid[r][col] === num) return false;
    }
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        if (grid[r][c] === num) return false;
      }
    }
    return true;
  }
  
  function solve(row: number, col: number): boolean {
    if (row === 9) return true;
    if (col === 9) return solve(row + 1, 0);
    if (grid[row][col] !== 0) return solve(row, col + 1);
    
    const shuffledValues = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    for (const num of shuffledValues) {
      if (isValid(row, col, num)) {
        grid[row][col] = num;
        if (solve(row, col + 1)) return true;
        grid[row][col] = 0;
      }
    }
    return false;
  }
  
  solve(0, 0);
  return grid;
}

// Determine how many cells to reveal based on puzzle difficulty
function getCellsToReveal(puzzleDifficulty: PuzzleDifficulty, gameMode: GameMode): number {
  const baseRevealed = {
    easy: 50,
    medium: 40,
    hard: 30,
    expert: 22,
  }[puzzleDifficulty];

  // Kids mode: more cells revealed to make it easier
  if (gameMode === 'kids') {
    return Math.min(55, baseRevealed + 10);
  }
  return baseRevealed;
}

// Get math difficulty level for expression generation
function getMathDifficultyLevel(mathDifficulty: MathDifficulty): number {
  return {
    basic: 3,
    intermediate: 10,
    advanced: 20,
    expert: 30,
  }[mathDifficulty];
}

// Generate a puzzle from a solution
export function generatePuzzle(level: number, gameMode: GameMode, difficultySettings?: DifficultySettings): { board: Cell[][]; solution: number[][] } {
  const solution = generateSolution();
  const board: Cell[][] = [];
  
  const puzzleDifficulty = difficultySettings?.puzzle || 'medium';
  const mathDifficulty = difficultySettings?.math || 'intermediate';
  const mathLevel = getMathDifficultyLevel(mathDifficulty);
  
  const cellsToReveal = getCellsToReveal(puzzleDifficulty, gameMode);
  const allPositions = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      allPositions.push({ row: r, col: c });
    }
  }
  
  const revealedPositions = shuffle(allPositions).slice(0, cellsToReveal);
  const revealedSet = new Set(revealedPositions.map(p => `${p.row}-${p.col}`));
  
  for (let row = 0; row < 9; row++) {
    const rowCells: Cell[] = [];
    for (let col = 0; col < 9; col++) {
      const value = solution[row][col];
      const isFixed = revealedSet.has(`${row}-${col}`);
      
      let expression = null;
      if (isFixed) {
        if (gameMode === 'math') {
          expression = generateExpression(value, mathLevel);
        } else if (gameMode === 'chemistry') {
          expression = generateChemistryExpression(value, mathLevel);
        }
      }
      
      rowCells.push({
        id: `${row}-${col}`,
        row,
        col,
        value: isFixed ? value : null,
        expression,
        isFixed,
        userAnswer: null,
        isCorrect: null,
        notes: [],
      });
    }
    board.push(rowCells);
  }
  
  return { board, solution };
}

// Check if the puzzle is complete
export function checkCompletion(board: Cell[][], solution: number[][]): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cell = board[row][col];
      const expected = solution[row][col];
      const actual = cell.isFixed ? cell.value : cell.userAnswer;
      if (actual !== expected) return false;
    }
  }
  return true;
}

// Get valid numbers for a cell
export function getValidNumbers(board: Cell[][], row: number, col: number, _solution: number[][]): number[] {
  const usedInRow = new Set<number>();
  const usedInCol = new Set<number>();
  const usedInBox = new Set<number>();
  
  for (let c = 0; c < 9; c++) {
    const cell = board[row][c];
    const val = cell.isFixed ? cell.value : cell.userAnswer;
    if (val !== null) usedInRow.add(val);
  }
  
  for (let r = 0; r < 9; r++) {
    const cell = board[r][col];
    const val = cell.isFixed ? cell.value : cell.userAnswer;
    if (val !== null) usedInCol.add(val);
  }
  
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      const cell = board[r][c];
      const val = cell.isFixed ? cell.value : cell.userAnswer;
      if (val !== null) usedInBox.add(val);
    }
  }
  
  const allValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  return allValues.filter(v => !usedInRow.has(v) && !usedInCol.has(v) && !usedInBox.has(v));
}

// Generate hint puzzles
export function generateHintPuzzle(_level: number, hintsUsed: number): HintPuzzle {
  const difficulty = Math.min(5, Math.floor(hintsUsed / 2) + 1);
  
  const puzzles: HintPuzzle[] = [];
  
  if (difficulty <= 2) {
    puzzles.push(
      { question: "¿Cuánto es 2 + 3?", answer: 5, options: [4, 5, 6, 7], difficulty: 1 },
      { question: "¿Cuánto es 4 × 2?", answer: 8, options: [6, 7, 8, 9], difficulty: 1 },
      { question: "¿Cuánto es 10 - 6?", answer: 4, options: [3, 4, 5, 6], difficulty: 1 },
      { question: "¿Cuánto es 12 ÷ 3?", answer: 4, options: [2, 3, 4, 5], difficulty: 1 },
      { question: "¿Qué número × 2 = 8?", answer: 4, options: [2, 3, 4, 5], difficulty: 2 },
      { question: "¿Cuánto es 3 + 3 + 3?", answer: 9, options: [6, 8, 9, 12], difficulty: 2 },
      { question: "¿Cuánto es 15 ÷ 3?", answer: 5, options: [3, 4, 5, 6], difficulty: 2 },
      { question: "¿Cuánto es 7 + 2?", answer: 9, options: [8, 9, 10, 11], difficulty: 1 },
    );
  }
  
  if (difficulty >= 2 && difficulty <= 4) {
    puzzles.push(
      { question: "¿Cuál es la raíz cuadrada de 16?", answer: 4, options: [2, 4, 6, 8], difficulty: 3 },
      { question: "¿Cuánto es 2³?", answer: 8, options: [4, 6, 8, 9], difficulty: 3 },
      { question: "Si x + 3 = 7, ¿cuánto vale x?", answer: 4, options: [3, 4, 5, 10], difficulty: 3 },
      { question: "¿Cuánto es ½ de 10?", answer: 5, options: [2, 5, 10, 20], difficulty: 3 },
      { question: "¿Cuál es el 25% de 20?", answer: 5, options: [4, 5, 6, 10], difficulty: 4 },
      { question: "Si 3/4 + x = 1, ¿cuánto vale x?", answer: 1, options: [1, 2, 3, 4], difficulty: 4 },
      { question: "¿Cuál es la raíz cuadrada de 81?", answer: 9, options: [7, 8, 9, 10], difficulty: 3 },
      { question: "¿Cuánto es 3²?", answer: 9, options: [6, 7, 8, 9], difficulty: 3 },
    );
  }
  
  if (difficulty >= 4) {
    puzzles.push(
      { question: "¿Cuánto es √25 + √9?", answer: 8, options: [6, 7, 8, 10], difficulty: 5 },
      { question: "¿Cuánto es 3² - 2²?", answer: 5, options: [1, 5, 7, 13], difficulty: 5 },
      { question: "Si 2x - 4 = 6, ¿cuánto vale x?", answer: 5, options: [1, 3, 5, 7], difficulty: 5 },
      { question: "¿Cuánto es 0.5 × 0.5 × 100?", answer: 25, options: [10, 25, 50, 100], difficulty: 5 },
      { question: "¿Cuánto es |-7| + |-3|?", answer: 10, options: [-10, 4, 10, -4], difficulty: 5 },
      { question: "¿Cuánto es √64 + 1?", answer: 9, options: [7, 8, 9, 10], difficulty: 5 },
    );
  }
  
  const validPuzzles = puzzles.filter(p => p.difficulty <= difficulty + 1);
  return validPuzzles[Math.floor(Math.random() * validPuzzles.length)] || puzzles[0];
}

// Generate kids-specific hint puzzles (simpler)
export function generateKidsHintPuzzle(hintsUsed: number): HintPuzzle {
  const difficulty = Math.min(3, Math.floor(hintsUsed / 3) + 1);
  
  const puzzles: HintPuzzle[] = [
    { question: "¿Cuánto es 1 + 1?", answer: 2, options: [1, 2, 3, 4], difficulty: 1 },
    { question: "¿Cuánto es 2 + 1?", answer: 3, options: [2, 3, 4, 5], difficulty: 1 },
    { question: "¿Cuánto es 3 + 2?", answer: 5, options: [4, 5, 6, 7], difficulty: 1 },
    { question: "¿Cuánto es 4 + 3?", answer: 7, options: [5, 6, 7, 8], difficulty: 1 },
    { question: "¿Cuánto es 5 - 2?", answer: 3, options: [2, 3, 4, 5], difficulty: 1 },
    { question: "¿Cuánto es 8 - 3?", answer: 5, options: [4, 5, 6, 7], difficulty: 1 },
    { question: "¿Cuánto es 2 × 3?", answer: 6, options: [4, 5, 6, 7], difficulty: 2 },
    { question: "¿Cuánto es 3 × 3?", answer: 9, options: [6, 7, 8, 9], difficulty: 2 },
    { question: "¿Cuánto es 4 × 2?", answer: 8, options: [6, 7, 8, 9], difficulty: 2 },
    { question: "¿Cuánto es 6 ÷ 2?", answer: 3, options: [2, 3, 4, 5], difficulty: 2 },
    { question: "¿Qué número + 4 = 9?", answer: 5, options: [4, 5, 6, 7], difficulty: 3 },
    { question: "¿Qué número × 2 = 6?", answer: 3, options: [2, 3, 4, 5], difficulty: 3 },
  ];
  
  const validPuzzles = puzzles.filter(p => p.difficulty <= difficulty + 1);
  return validPuzzles[Math.floor(Math.random() * validPuzzles.length)] || puzzles[0];
}

// Initialize game state
export function initializeGame(level: number, gameMode: GameMode = 'math', difficultySettings?: DifficultySettings): GameState {
  const { board, solution } = generatePuzzle(level, gameMode, difficultySettings);
  
  const puzzleDifficulty = difficultySettings?.puzzle || 'medium';
  
  return {
    board,
    solution,
    level,
    difficulty: puzzleDifficulty,
    startTime: Date.now(),
    elapsedTime: 0,
    errors: 0,
    hintsUsed: 0,
    isComplete: false,
    isPaused: false,
    gameMode,
  };
}
