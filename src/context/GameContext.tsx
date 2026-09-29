import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import { GameState, Settings, PlayerStats, SavedGame, Achievement, PlayerProfile, MAX_ERRORS, GameMode, DifficultySettings } from '@/types/game';
import { initializeGame, checkCompletion, getValidNumbers, generateHintPuzzle, generateKidsHintPuzzle } from '@/utils/puzzleGenerator';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface GameContextType {
  gameState: GameState | null;
  selectedCell: { row: number; col: number } | null;
  isNoteMode: boolean;
  validNumbers: number[];
  settings: Settings;
  stats: PlayerStats;
  savedGames: SavedGame[];
  achievements: Achievement[];
  playerProfile: PlayerProfile | null;
  hintPuzzle: ReturnType<typeof generateHintPuzzle> | null;
  showHintPuzzle: boolean;
  isGameOver: boolean;
  lastInputWasError: boolean;
  gameMode: GameMode;
  
  selectCell: (row: number, col: number) => void;
  inputNumber: (value: number) => void;
  clearCell: () => void;
  toggleNoteMode: () => void;
  toggleNote: (value: number) => void;
  newGame: (level: number, mode?: GameMode) => void;
  newPuzzleSameLevel: () => void;
  restartGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  saveGame: (name: string) => void;
  loadGame: (savedGame: SavedGame) => void;
  deleteSavedGame: (id: string) => void;
  requestHint: () => void;
  answerHintPuzzle: (answer: number) => void;
  cancelHintPuzzle: () => void;
  updateSettings: (settings: Partial<Settings>) => void;
  setPlayerProfile: (profile: PlayerProfile) => void;
  setGameMode: (mode: GameMode) => void;
  exportData: () => string;
  importData: (data: string) => boolean;
  dismissGameOver: () => void;
  clearLastInputError: () => void;
  clearCurrentGame: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

type Action =
  | { type: 'SET_GAME'; gameState: GameState }
  | { type: 'SELECT_CELL'; row: number; col: number }
  | { type: 'DESELECT_CELL' }
  | { type: 'INPUT_NUMBER'; value: number }
  | { type: 'CLEAR_CELL' }
  | { type: 'TOGGLE_NOTE'; value: number }
  | { type: 'TICK' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'USE_HINT'; row: number; col: number; value: number }
  | { type: 'CLEAR_LAST_ERROR' }
  | { type: 'DISMISS_GAME_OVER' };

interface State {
  gameState: GameState | null;
  selectedCell: { row: number; col: number } | null;
  isNoteMode: boolean;
  isGameOver: boolean;
  lastInputWasError: boolean;
}

function gameReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_GAME':
      return {
        ...state,
        gameState: action.gameState,
        selectedCell: null,
        isNoteMode: false,
        isGameOver: false,
        lastInputWasError: false,
      };
      
    case 'SELECT_CELL':
      return {
        ...state,
        selectedCell: { row: action.row, col: action.col },
      };
      
    case 'DESELECT_CELL':
      return {
        ...state,
        selectedCell: null,
      };
      
    case 'INPUT_NUMBER': {
      if (!state.gameState || !state.selectedCell) return state;
      const { row, col } = state.selectedCell;
      const cell = state.gameState.board[row][col];
      if (cell.isFixed) return state;
      
      const newBoard = state.gameState.board.map(r => r.map(c => ({ ...c })));
      const expectedValue = state.gameState.solution[row][col];
      const isCorrect = action.value === expectedValue;
      
      newBoard[row][col] = {
        ...newBoard[row][col],
        userAnswer: action.value,
        isCorrect,
        notes: [],
      };
      
      const newErrors = state.gameState.errors + (isCorrect ? 0 : 1);
      const isComplete = checkCompletion(newBoard, state.gameState.solution);
      const isGameOver = newErrors >= MAX_ERRORS;
      
      return {
        ...state,
        gameState: {
          ...state.gameState,
          board: newBoard,
          errors: newErrors,
          isComplete,
        },
        isGameOver,
        lastInputWasError: !isCorrect,
      };
    }
    
    case 'CLEAR_LAST_ERROR':
      return {
        ...state,
        lastInputWasError: false,
      };
    
    case 'DISMISS_GAME_OVER':
      return {
        ...state,
        isGameOver: false,
      };
    
    case 'CLEAR_CELL': {
      if (!state.gameState || !state.selectedCell) return state;
      const { row, col } = state.selectedCell;
      const cell = state.gameState.board[row][col];
      if (cell.isFixed) return state;
      
      const newBoard = state.gameState.board.map(r => r.map(c => ({ ...c })));
      newBoard[row][col] = {
        ...newBoard[row][col],
        userAnswer: null,
        isCorrect: null,
        notes: [],
      };
      
      return {
        ...state,
        gameState: {
          ...state.gameState,
          board: newBoard,
        },
      };
    }
    
    case 'TOGGLE_NOTE': {
      if (!state.gameState || !state.selectedCell) return state;
      const { row, col } = state.selectedCell;
      const cell = state.gameState.board[row][col];
      if (cell.isFixed || cell.userAnswer !== null) return state;
      
      const newBoard = state.gameState.board.map(r => r.map(c => ({ ...c })));
      const currentNotes = [...newBoard[row][col].notes];
      const noteIndex = currentNotes.indexOf(action.value);
      
      if (noteIndex >= 0) {
        currentNotes.splice(noteIndex, 1);
      } else {
        currentNotes.push(action.value);
        currentNotes.sort((a, b) => a - b);
      }
      
      newBoard[row][col].notes = currentNotes;
      
      return {
        ...state,
        gameState: {
          ...state.gameState,
          board: newBoard,
        },
      };
    }
    
    case 'TICK': {
      if (!state.gameState || state.gameState.isPaused || state.gameState.isComplete) {
        return state;
      }
      return {
        ...state,
        gameState: {
          ...state.gameState,
          elapsedTime: state.gameState.elapsedTime + 1,
        },
      };
    }
    
    case 'PAUSE':
      if (!state.gameState) return state;
      return {
        ...state,
        gameState: {
          ...state.gameState,
          isPaused: true,
        },
      };
      
    case 'RESUME':
      if (!state.gameState) return state;
      return {
        ...state,
        gameState: {
          ...state.gameState,
          isPaused: false,
        },
      };
      
    case 'USE_HINT': {
      if (!state.gameState) return state;
      
      const newBoard = state.gameState.board.map(r => r.map(c => ({ ...c })));
      newBoard[action.row][action.col] = {
        ...newBoard[action.row][action.col],
        userAnswer: action.value,
        isCorrect: true,
        notes: [],
      };
      
      const isComplete = checkCompletion(newBoard, state.gameState.solution);
      
      return {
        ...state,
        gameState: {
          ...state.gameState,
          board: newBoard,
          hintsUsed: state.gameState.hintsUsed + 1,
          isComplete,
        },
      };
    }
    
    default:
      return state;
  }
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const storage = useLocalStorage();
  const [state, dispatch] = useReducer(gameReducer, {
    gameState: null,
    selectedCell: null,
    isNoteMode: false,
    isGameOver: false,
    lastInputWasError: false,
  });
  
  const [showHintPuzzle, setShowHintPuzzle] = React.useState(false);
  const [hintPuzzle, setHintPuzzle] = React.useState<ReturnType<typeof generateHintPuzzle> | null>(null);
  const [isNoteMode, setIsNoteMode] = React.useState(false);
  const [gameMode, setGameModeState] = React.useState<GameMode>(() => {
    return storage.playerProfile?.preferredMode || 'math';
  });
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load saved game on mount
  useEffect(() => {
    const savedGame = storage.loadCurrentGame();
    if (savedGame) {
      dispatch({ type: 'SET_GAME', gameState: savedGame });
      setGameModeState(savedGame.gameMode || 'math');
    } else {
      const mode = storage.playerProfile?.preferredMode || 'math';
      const diff = storage.settings.manualDifficulty ? storage.settings.difficulty : undefined;
      dispatch({ type: 'SET_GAME', gameState: initializeGame(1, mode, diff) });
      setGameModeState(mode);
    }
  }, []);

  // Auto-save current game
  useEffect(() => {
    if (state.gameState && !state.gameState.isComplete) {
      storage.saveCurrentGame(state.gameState);
    }
  }, [state.gameState]);

  // Timer
  useEffect(() => {
    if (state.gameState && !state.gameState.isPaused && !state.gameState.isComplete) {
      timerRef.current = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [state.gameState?.isPaused, state.gameState?.isComplete]);

  // Record win - DON'T clear current game here, let user choose next level or quit
  useEffect(() => {
    if (state.gameState?.isComplete) {
      storage.recordGameWin(
        state.gameState.level,
        state.gameState.elapsedTime,
        state.gameState.errors
      );
      // Game stays saved until user explicitly starts new game or quits
    }
  }, [state.gameState?.isComplete]);

  const validNumbers = React.useMemo(() => {
    if (!state.gameState || !state.selectedCell) return [];
    return getValidNumbers(
      state.gameState.board,
      state.selectedCell.row,
      state.selectedCell.col,
      state.gameState.solution
    );
  }, [state.gameState, state.selectedCell]);

  const selectCell = useCallback((row: number, col: number) => {
    dispatch({ type: 'SELECT_CELL', row, col });
  }, []);

  const inputNumber = useCallback((value: number) => {
    if (isNoteMode) {
      dispatch({ type: 'TOGGLE_NOTE', value });
    } else {
      dispatch({ type: 'INPUT_NUMBER', value });
    }
  }, [isNoteMode]);

  const clearCell = useCallback(() => {
    dispatch({ type: 'CLEAR_CELL' });
  }, []);

  const toggleNoteMode = useCallback(() => {
    setIsNoteMode(prev => !prev);
  }, []);

  const toggleNote = useCallback((value: number) => {
    dispatch({ type: 'TOGGLE_NOTE', value });
  }, []);

  const newGame = useCallback((level: number, mode?: GameMode, difficultySettings?: DifficultySettings) => {
    const m = mode || gameMode;
    const diff = difficultySettings || (storage.settings.manualDifficulty ? storage.settings.difficulty : undefined);
    dispatch({ type: 'SET_GAME', gameState: initializeGame(level, m, diff) });
    setIsNoteMode(false);
    if (mode) setGameModeState(mode);
  }, [gameMode, storage.settings.manualDifficulty, storage.settings.difficulty]);

  const newPuzzleSameLevel = useCallback(() => {
    if (!state.gameState) return;
    const diff = storage.settings.manualDifficulty ? storage.settings.difficulty : undefined;
    dispatch({ type: 'SET_GAME', gameState: initializeGame(state.gameState.level, gameMode, diff) });
    setIsNoteMode(false);
  }, [state.gameState, gameMode, storage.settings.manualDifficulty, storage.settings.difficulty]);

  const restartGame = useCallback(() => {
    if (!state.gameState) return;
    const newBoard = state.gameState.board.map(row =>
      row.map(cell => ({
        ...cell,
        userAnswer: cell.isFixed ? cell.userAnswer : null,
        isCorrect: cell.isFixed ? cell.isCorrect : null,
        notes: [],
      }))
    );
    dispatch({
      type: 'SET_GAME',
      gameState: {
        ...state.gameState,
        board: newBoard,
        elapsedTime: 0,
        errors: 0,
        hintsUsed: 0,
        isComplete: false,
        startTime: Date.now(),
      },
    });
    setIsNoteMode(false);
  }, [state.gameState]);

  const pauseGame = useCallback(() => {
    dispatch({ type: 'PAUSE' });
  }, []);

  const resumeGame = useCallback(() => {
    dispatch({ type: 'RESUME' });
  }, []);

  const saveGameAction = useCallback((name: string) => {
    if (state.gameState) {
      storage.saveGame(state.gameState, name);
    }
  }, [state.gameState, storage]);

  const loadGame = useCallback((savedGame: SavedGame) => {
    dispatch({ type: 'SET_GAME', gameState: savedGame.gameState });
    setGameModeState(savedGame.gameState.gameMode || 'math');
  }, []);

  const requestHint = useCallback(() => {
    if (!state.gameState || !state.selectedCell) return;
    const puzzle = gameMode === 'kids'
      ? generateKidsHintPuzzle(state.gameState.hintsUsed)
      : generateHintPuzzle(state.gameState.level, state.gameState.hintsUsed);
    setHintPuzzle(puzzle);
    setShowHintPuzzle(true);
  }, [state.gameState, state.selectedCell, gameMode]);

  const answerHintPuzzle = useCallback((answer: number) => {
    if (!hintPuzzle || !state.selectedCell || !state.gameState) return;
    
    if (answer === hintPuzzle.answer) {
      const { row, col } = state.selectedCell;
      const correctValue = state.gameState.solution[row][col];
      dispatch({ type: 'USE_HINT', row, col, value: correctValue });
    }
    
    setShowHintPuzzle(false);
    setHintPuzzle(null);
  }, [hintPuzzle, state.selectedCell, state.gameState]);

  const cancelHintPuzzle = useCallback(() => {
    setShowHintPuzzle(false);
    setHintPuzzle(null);
  }, []);

  const dismissGameOver = useCallback(() => {
    dispatch({ type: 'DISMISS_GAME_OVER' });
  }, []);

  const clearLastInputError = useCallback(() => {
    dispatch({ type: 'CLEAR_LAST_ERROR' });
  }, []);

  const setGameMode = useCallback((mode: GameMode) => {
    setGameModeState(mode);
    // Save preference
    if (storage.playerProfile) {
      storage.setPlayerProfile({ ...storage.playerProfile, preferredMode: mode });
    }
  }, [storage]);

  const clearCurrentGame = useCallback(() => {
    storage.clearCurrentGame();
  }, [storage]);

  const value: GameContextType = {
    gameState: state.gameState,
    selectedCell: state.selectedCell,
    isNoteMode,
    validNumbers,
    settings: storage.settings,
    stats: storage.stats,
    savedGames: storage.savedGames,
    achievements: storage.achievements,
    playerProfile: storage.playerProfile,
    hintPuzzle,
    showHintPuzzle,
    isGameOver: state.isGameOver,
    lastInputWasError: state.lastInputWasError,
    gameMode,
    selectCell,
    inputNumber,
    clearCell,
    toggleNoteMode,
    toggleNote,
    newGame,
    newPuzzleSameLevel,
    restartGame,
    pauseGame,
    resumeGame,
    saveGame: saveGameAction,
    loadGame,
    deleteSavedGame: storage.deleteSavedGame,
    requestHint,
    answerHintPuzzle,
    cancelHintPuzzle,
    updateSettings: storage.updateSettings,
    setPlayerProfile: storage.setPlayerProfile,
    setGameMode,
    exportData: storage.exportData,
    importData: storage.importData,
    dismissGameOver,
    clearLastInputError,
    clearCurrentGame,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
