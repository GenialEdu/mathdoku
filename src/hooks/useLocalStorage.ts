import { useState, useEffect, useCallback } from 'react';
import { GameState, PlayerStats, Settings, SavedGame, Achievement, DailyChallenge, PlayerProfile, DifficultySettings } from '@/types/game';

const STORAGE_KEYS = {
  CURRENT_GAME: 'mathdoku_current_game',
  SAVED_GAMES: 'mathdoku_saved_games',
  PLAYER_STATS: 'mathdoku_player_stats',
  PLAYER_PROFILE: 'mathdoku_player_profile',
  SETTINGS: 'mathdoku_settings',
  ACHIEVEMENTS: 'mathdoku_achievements',
  DAILY_CHALLENGES: 'mathdoku_daily_challenges',
};

const defaultStats: PlayerStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  totalTime: 0,
  bestTime: {},
  totalErrors: 0,
  currentStreak: 0,
  bestStreak: 0,
  levelsCompleted: [],
  xp: 0,
  rank: 'Novato',
};

const defaultDifficulty: DifficultySettings = {
  math: 'intermediate',
  puzzle: 'medium',
};

const defaultSettings: Settings = {
  theme: 'auto',
  soundEnabled: true,
  musicEnabled: true,
  vibrationEnabled: true,
  showTimer: true,
  autoCheckErrors: true,
  highlightSameNumbers: true,
  fontSize: 'medium',
  difficulty: defaultDifficulty,
  manualDifficulty: false,
};

function safeJSONParse<T>(json: string | null, defaultValue: T): T {
  if (!json) return defaultValue;
  try {
    return JSON.parse(json) as T;
  } catch {
    return defaultValue;
  }
}

export function useLocalStorage() {
  const [stats, setStatsState] = useState<PlayerStats>(() => 
    safeJSONParse(localStorage.getItem(STORAGE_KEYS.PLAYER_STATS), defaultStats)
  );
  
  const [playerProfile, setPlayerProfileState] = useState<PlayerProfile | null>(() =>
    safeJSONParse(localStorage.getItem(STORAGE_KEYS.PLAYER_PROFILE), null)
  );
  
  const [settings, setSettingsState] = useState<Settings>(() =>
    safeJSONParse(localStorage.getItem(STORAGE_KEYS.SETTINGS), defaultSettings)
  );
  
  const [savedGames, setSavedGamesState] = useState<SavedGame[]>(() =>
    safeJSONParse(localStorage.getItem(STORAGE_KEYS.SAVED_GAMES), [])
  );
  
  const [achievements, setAchievementsState] = useState<Achievement[]>(() =>
    safeJSONParse(localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS), [])
  );
  
  const [dailyChallenges, setDailyChallengesState] = useState<DailyChallenge[]>(() =>
    safeJSONParse(localStorage.getItem(STORAGE_KEYS.DAILY_CHALLENGES), [])
  );

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLAYER_STATS, JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    if (playerProfile) {
      localStorage.setItem(STORAGE_KEYS.PLAYER_PROFILE, JSON.stringify(playerProfile));
    }
  }, [playerProfile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SAVED_GAMES, JSON.stringify(savedGames));
  }, [savedGames]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DAILY_CHALLENGES, JSON.stringify(dailyChallenges));
  }, [dailyChallenges]);

  // Player profile management
  const setPlayerProfile = useCallback((profile: PlayerProfile) => {
    setPlayerProfileState(profile);
  }, []);

  // Game state management
  const saveCurrentGame = useCallback((gameState: GameState) => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_GAME, JSON.stringify(gameState));
  }, []);

  const loadCurrentGame = useCallback((): GameState | null => {
    return safeJSONParse(localStorage.getItem(STORAGE_KEYS.CURRENT_GAME), null);
  }, []);

  const clearCurrentGame = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_GAME);
  }, []);

  // Saved games management
  const saveGame = useCallback((gameState: GameState, name: string) => {
    const newSavedGame: SavedGame = {
      id: Date.now().toString(),
      gameState,
      savedAt: Date.now(),
      name,
    };
    setSavedGamesState(prev => [newSavedGame, ...prev].slice(0, 10)); // Keep last 10
  }, []);

  const deleteSavedGame = useCallback((id: string) => {
    setSavedGamesState(prev => prev.filter(g => g.id !== id));
  }, []);

  // Stats management
  const updateStats = useCallback((updates: Partial<PlayerStats>) => {
    setStatsState(prev => {
      const newStats = { ...prev, ...updates };
      // Calculate rank based on XP
      if (newStats.xp < 100) newStats.rank = 'Novato';
      else if (newStats.xp < 500) newStats.rank = 'Aprendiz';
      else if (newStats.xp < 1500) newStats.rank = 'Estudiante';
      else if (newStats.xp < 3000) newStats.rank = 'Matemático';
      else if (newStats.xp < 6000) newStats.rank = 'Experto';
      else if (newStats.xp < 10000) newStats.rank = 'Maestro';
      else newStats.rank = 'Gran Maestro';
      return newStats;
    });
  }, []);

  const recordGameWin = useCallback((level: number, time: number, errors: number) => {
    setStatsState(prev => {
      const xpGain = Math.max(10, 100 - errors * 10 + level * 5);
      const newBestTime = { ...prev.bestTime };
      if (!newBestTime[level] || time < newBestTime[level]) {
        newBestTime[level] = time;
      }
      return {
        ...prev,
        gamesPlayed: prev.gamesPlayed + 1,
        gamesWon: prev.gamesWon + 1,
        totalTime: prev.totalTime + time,
        bestTime: newBestTime,
        totalErrors: prev.totalErrors + errors,
        currentStreak: prev.currentStreak + 1,
        bestStreak: Math.max(prev.bestStreak, prev.currentStreak + 1),
        levelsCompleted: [...new Set([...prev.levelsCompleted, level])],
        xp: prev.xp + xpGain,
      };
    });
  }, []);

  // Settings management
  const updateSettings = useCallback((updates: Partial<Settings>) => {
    setSettingsState(prev => ({ ...prev, ...updates }));
  }, []);

  // Export/Import
  const exportData = useCallback(() => {
    const data = {
      stats,
      playerProfile,
      settings,
      savedGames,
      achievements,
      dailyChallenges,
      exportedAt: Date.now(),
    };
    return JSON.stringify(data);
  }, [stats, playerProfile, settings, savedGames, achievements, dailyChallenges]);

  const importData = useCallback((jsonData: string) => {
    try {
      const data = JSON.parse(jsonData);
      if (data.stats) setStatsState(data.stats);
      if (data.playerProfile) setPlayerProfileState(data.playerProfile);
      if (data.settings) setSettingsState(data.settings);
      if (data.savedGames) setSavedGamesState(data.savedGames);
      if (data.achievements) setAchievementsState(data.achievements);
      if (data.dailyChallenges) setDailyChallengesState(data.dailyChallenges);
      return true;
    } catch {
      return false;
    }
  }, []);

  return {
    stats,
    playerProfile,
    settings,
    savedGames,
    achievements,
    dailyChallenges,
    setPlayerProfile,
    saveCurrentGame,
    loadCurrentGame,
    clearCurrentGame,
    saveGame,
    deleteSavedGame,
    updateStats,
    recordGameWin,
    updateSettings,
    exportData,
    importData,
    setAchievements: setAchievementsState,
    setDailyChallenges: setDailyChallengesState,
  };
}
