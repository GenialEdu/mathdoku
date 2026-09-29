import { useState, useEffect } from 'react';
import { GameProvider, useGame } from '@/context/GameContext';
import { GameBoard } from '@/components/GameBoard';
import { NumberPad } from '@/components/NumberPad';
import { GameHeader } from '@/components/GameHeader';
import { ShapeLegend } from '@/components/KidsShapes';
import {
  WelcomeModal,
  MenuModal,
  NewGameModal,
  StatsModal,
  SavedGamesModal,
  HintPuzzleModal,
  VictoryModal,
  SettingsModal,
  AchievementsModal,
  GameOverModal,
} from '@/components/Modals';
import { useAudioSystem } from '@/hooks/useAudioSystem';
import { cn } from '@/utils/cn';
import { GameMode } from '@/types/game';

function GameScreen() {
  const { 
    gameState, 
    settings, 
    newGame, 
    playerProfile, 
    setPlayerProfile, 
    resumeGame,
    isGameOver,
    dismissGameOver,
    lastInputWasError,
    clearLastInputError,
    updateSettings,
    gameMode,
    setGameMode,
    clearCurrentGame,
  } = useGame();
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [newGameOpen, setNewGameOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [savedGamesOpen, setSavedGamesOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [victoryOpen, setVictoryOpen] = useState(false);
  const [gameOverOpen, setGameOverOpen] = useState(false);

  const { 
    playError, 
    playVictory, 
    playGameOver,
    playClick,
    toggleMusic,
    isMusicPlaying,
    enableAudioOnInteraction,
  } = useAudioSystem(settings.soundEnabled, settings.musicEnabled);

  const showWelcome = !playerProfile;
  const isKids = gameMode === 'kids';
  const isChemistry = gameMode === 'chemistry';

  // Dark mode
  useEffect(() => {
    const isDark =
      settings.theme === 'dark' ||
      (settings.theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', isDark);
  }, [settings.theme]);

  // Victory detection
  useEffect(() => {
    if (gameState?.isComplete) {
      playVictory();
      setTimeout(() => setVictoryOpen(true), 500);
    }
  }, [gameState?.isComplete, playVictory]);

  // Game Over detection
  useEffect(() => {
    if (isGameOver && !gameOverOpen) {
      playGameOver();
      setGameOverOpen(true);
    }
  }, [isGameOver, gameOverOpen, playGameOver]);

  // Error sound effect
  useEffect(() => {
    if (lastInputWasError) {
      playError();
      if (settings.vibrationEnabled && navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
      clearLastInputError();
    }
  }, [lastInputWasError, playError, settings.vibrationEnabled, clearLastInputError]);

  const handleWelcomeComplete = (nickname: string, mode: GameMode) => {
    setPlayerProfile({
      nickname,
      createdAt: Date.now(),
      preferredMode: mode,
    });
    setGameMode(mode);
    newGame(1, mode);
    enableAudioOnInteraction();
  };

  const handleGameOverClose = () => {
    setGameOverOpen(false);
    dismissGameOver();
    // Don't clear - let them resume or restart
  };

  const handleGameOverQuit = () => {
    setGameOverOpen(false);
    dismissGameOver();
    clearCurrentGame(); // Clear only when explicitly quitting
  };

  const handleVictoryClose = () => {
    setVictoryOpen(false);
    clearCurrentGame(); // Clear when dismissing victory without continuing
  };

  const handleNextLevel = () => {
    if (gameState) {
      newGame(Math.min(30, gameState.level + 1));
    }
    setVictoryOpen(false);
    // Don't clear - newGame will overwrite
  };

  const handleMainClick = () => {
    enableAudioOnInteraction();
    playClick();
    if (gameState?.isPaused && !gameState?.isComplete) {
      resumeGame();
    }
  };

  const handleToggleMusic = () => {
    updateSettings({ musicEnabled: !settings.musicEnabled });
    toggleMusic();
  };

  return (
    <div 
      onClick={handleMainClick}
      className={cn(
        "min-h-screen flex flex-col items-center justify-start p-2 sm:p-4 pt-4 sm:pt-6 pb-6 sm:pb-8",
        "transition-colors duration-300",
        isKids
          ? "bg-gradient-to-br from-pink-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-pink-950"
          : isChemistry
          ? "bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-950"
          : "bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950"
      )}
    >
      {/* Welcome Modal */}
      <WelcomeModal isOpen={showWelcome} onComplete={handleWelcomeComplete} />

      {!showWelcome && (
        <>
          {/* Logo and Music Toggle */}
          <div className="w-full max-w-[480px] mx-auto flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex-1" />
            <div className="text-center flex-1">
              <h1 className={cn(
                "text-xl sm:text-2xl md:text-3xl font-black bg-clip-text text-transparent",
                isKids
                  ? "bg-gradient-to-r from-pink-600 via-orange-500 to-yellow-500"
                  : isChemistry
                  ? "bg-gradient-to-r from-emerald-600 via-teal-500 to-green-500"
                  : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
              )}>
                {isKids ? '🎨 MathDoku Kids' : isChemistry ? '🧪 MathDoku Chemistry' : '🧮 MathDoku Quest'}
              </h1>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                {isKids 
                  ? 'Sudoku con Figuras de Colores 9×9'
                  : isChemistry
                  ? 'Tabla Periódica 9×9 • Aprende Química'
                  : 'Sudoku Matemático 9×9 • Aprende jugando'
                }
              </p>
            </div>
            <div className="flex-1 flex justify-end">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleMusic();
                }}
                className={cn(
                  "p-2 rounded-xl transition-all active:scale-95 shadow-md",
                  isMusicPlaying || settings.musicEnabled
                    ? isKids
                      ? "bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400"
                      : isChemistry
                      ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400"
                      : "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                )}
                aria-label={isMusicPlaying ? "Silenciar música" : "Activar música"}
              >
                {isMusicPlaying || settings.musicEnabled ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Game Header */}
          <GameHeader
            onMenuOpen={() => setMenuOpen(true)}
            onSettingsOpen={() => setSettingsOpen(true)}
          />

          {/* Kids mode shape legend - compact */}
          {isKids && (
            <div className="w-full max-w-[420px] mx-auto mb-2">
              <ShapeLegend compact={true} />
            </div>
          )}

          {/* Paused Overlay */}
          {gameState?.isPaused && !gameState?.isComplete && (
            <div className="fixed inset-0 bg-white/90 dark:bg-gray-900/90 flex items-center justify-center z-40 backdrop-blur-sm">
              <div className="text-center">
                <div className="text-6xl mb-4">⏸️</div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Juego Pausado</h2>
                <p className="text-gray-500 mb-4">
                  {playerProfile?.nickname}, toca para continuar
                </p>
              </div>
            </div>
          )}

          {/* Game Board */}
          <GameBoard />

          {/* Number Pad */}
          <NumberPad />

          {/* Footer */}
          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500">
              MathDoku Quest • Para jugadores de 10 años en adelante
            </p>
            <p className="text-[9px] sm:text-[10px] text-gray-300 dark:text-gray-600 mt-1">
              {isKids 
                ? '🎨 Cada figura de color representa un número del 1 al 9'
                : isChemistry
                ? '🧪 Cada elemento representa su número atómico (1-9)'
                : '💡 Las expresiones matemáticas son equivalentes al número que representan'
              }
            </p>
          </div>

          {/* Modals */}
          <MenuModal
            isOpen={menuOpen}
            onClose={() => setMenuOpen(false)}
            onNewGame={() => setNewGameOpen(true)}
            onStats={() => setStatsOpen(true)}
            onSavedGames={() => setSavedGamesOpen(true)}
            onAchievements={() => setAchievementsOpen(true)}
          />
          <NewGameModal isOpen={newGameOpen} onClose={() => setNewGameOpen(false)} />
          <StatsModal isOpen={statsOpen} onClose={() => setStatsOpen(false)} />
          <SavedGamesModal isOpen={savedGamesOpen} onClose={() => setSavedGamesOpen(false)} />
          <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
          <AchievementsModal isOpen={achievementsOpen} onClose={() => setAchievementsOpen(false)} />
          <HintPuzzleModal />
          <VictoryModal
            isOpen={victoryOpen}
            onClose={() => setVictoryOpen(false)}
            onNewGame={handleNextLevel}
          />
          <GameOverModal
            isOpen={gameOverOpen}
            onNewGame={handleGameOverClose}
            onQuit={handleGameOverQuit}
          />
        </>
      )}
    </div>
  );
}

export function App() {
  return (
    <GameProvider>
      <GameScreen />
    </GameProvider>
  );
}
