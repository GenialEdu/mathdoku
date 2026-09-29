import { useGame } from '@/context/GameContext';
import { cn } from '@/utils/cn';

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function getLevelDescription(level: number, isKids: boolean, isChemistry: boolean): string {
  if (isKids) return 'Figuras de Colores';
  if (isChemistry) return 'Tabla Periódica (1-9)';
  if (level <= 5) return 'Enteros positivos';
  if (level <= 10) return 'Enteros negativos';
  if (level <= 15) return 'Fracciones';
  if (level <= 20) return 'Decimales y %';
  if (level <= 25) return 'Raíces y potencias';
  return 'Combinaciones';
}

interface GameHeaderProps {
  onMenuOpen: () => void;
  onSettingsOpen: () => void;
}

export function GameHeader({ onMenuOpen, onSettingsOpen }: GameHeaderProps) {
  const { gameState, pauseGame, resumeGame, settings, playerProfile, stats, gameMode } = useGame();

  if (!gameState) return null;

  const isKids = gameMode === 'kids';
  const isChemistry = gameMode === 'chemistry';

  return (
    <div className="w-full max-w-[480px] mx-auto mb-4">
      {/* Player greeting */}
      {playerProfile && (
        <div className="text-center mb-2">
          <span className={cn(
            "text-sm",
            isKids ? "text-pink-600 dark:text-pink-400" : isChemistry ? "text-emerald-600 dark:text-emerald-400" : "text-gray-600 dark:text-gray-400"
          )}>
            {isKids ? '🌟' : isChemistry ? '🧪' : '👋'} ¡Hola, <span className={cn(
              "font-bold",
isKids ? "text-pink-600 dark:text-pink-400" : isChemistry ? "text-emerald-600 dark:text-emerald-400" : "text-indigo-600 dark:text-indigo-400"
            )}>{playerProfile.nickname}</span>! 
            <span className="ml-2">🏅 {stats.rank}</span>
            {isKids && <span className="ml-2">🧒 Modo Niños</span>}
            {isChemistry && <span className="ml-2">🧪 Modo Química</span>}
          </span>
        </div>
      )}

      {/* Top bar */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={onMenuOpen}
          className={cn(
            "p-2 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95",
            isKids ? "bg-pink-50 dark:bg-pink-900/30" : "bg-white dark:bg-gray-800"
          )}
          aria-label="Menú"
        >
          <svg className={cn(
            "w-6 h-6",
            isKids ? "text-pink-600 dark:text-pink-400" : "text-gray-700 dark:text-gray-300"
          )} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <div className={cn(
            "px-3 py-1.5 rounded-full font-bold text-sm shadow-md text-white",
            isKids
              ? "bg-gradient-to-r from-pink-500 to-orange-500"
              : isChemistry
              ? "bg-gradient-to-r from-emerald-500 to-teal-500"
              : "bg-gradient-to-r from-indigo-500 to-purple-500"
          )}>
            {isKids ? '🎨' : isChemistry ? '🧪' : '📐'} Nivel {gameState.level}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 max-w-[100px] truncate">
            {getLevelDescription(gameState.level, isKids, isChemistry)}
          </span>
        </div>

        <button
          onClick={onSettingsOpen}
          className={cn(
            "p-2 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95",
            isKids ? "bg-pink-50 dark:bg-pink-900/30" : isChemistry ? "bg-emerald-50 dark:bg-emerald-900/30" : "bg-white dark:bg-gray-800"
          )}
          aria-label="Configuración"
        >
          <svg className={cn(
            "w-6 h-6",
            isKids ? "text-pink-600 dark:text-pink-400" : isChemistry ? "text-emerald-600 dark:text-emerald-400" : "text-gray-700 dark:text-gray-300"
          )} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-2">
        {/* Timer */}
        {settings.showTimer && (
          <button
            onClick={() => gameState.isPaused ? resumeGame() : pauseGame()}
            className={cn(
              "flex flex-col items-center justify-center p-2 rounded-xl transition-all",
              "shadow-md hover:shadow-lg active:scale-95",
              isKids ? "bg-pink-50 dark:bg-pink-900/20" : isChemistry ? "bg-emerald-50 dark:bg-emerald-900/20" : "bg-white dark:bg-gray-800",
              gameState.isPaused && "bg-yellow-100 dark:bg-yellow-900/30"
            )}
          >
            <div className="flex items-center gap-1">
              {gameState.isPaused ? (
                <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              ) : (
                <svg className={cn("w-4 h-4", isKids ? "text-pink-600 dark:text-pink-400" : isChemistry ? "text-emerald-600 dark:text-emerald-400" : "text-indigo-600 dark:text-indigo-400")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span className={cn(
                "font-mono font-bold text-sm",
                gameState.isPaused ? "text-yellow-600" : "text-gray-800 dark:text-gray-200"
              )}>
                {formatTime(gameState.elapsedTime)}
              </span>
            </div>
            <span className="text-[10px] text-gray-400">
              {gameState.isPaused ? 'Continuar' : 'Tiempo'}
            </span>
          </button>
        )}

        {/* Errors */}
        <div className={cn(
          "flex flex-col items-center justify-center p-2 rounded-xl shadow-md",
          isKids ? "bg-pink-50 dark:bg-pink-900/20" : isChemistry ? "bg-emerald-50 dark:bg-emerald-900/20" : "bg-white dark:bg-gray-800"
        )}>
          <div className="flex items-center gap-0.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className={cn(
                "text-base transition-all",
                i < gameState.errors ? "text-red-500 scale-90 opacity-50" : "text-red-500"
              )}>
                {i < gameState.errors ? '💔' : '❤️'}
              </span>
            ))}
          </div>
          <span className="text-[10px] text-gray-400">{gameState.errors}/3 Errores</span>
        </div>

        {/* Hints */}
        <div className={cn(
          "flex flex-col items-center justify-center p-2 rounded-xl shadow-md",
          isKids ? "bg-pink-50 dark:bg-pink-900/20" : isChemistry ? "bg-emerald-50 dark:bg-emerald-900/20" : "bg-white dark:bg-gray-800"
        )}>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span className="font-bold text-sm text-gray-800 dark:text-gray-200">
              {gameState.hintsUsed}
            </span>
          </div>
          <span className="text-[10px] text-gray-400">Pistas</span>
        </div>

        {/* Difficulty / Mode indicator */}
        <div className={cn(
          "flex flex-col items-center justify-center p-2 rounded-xl shadow-md",
          isKids ? "bg-pink-50 dark:bg-pink-900/20" : isChemistry ? "bg-emerald-50 dark:bg-emerald-900/20" : "bg-white dark:bg-gray-800"
        )}>
          {isKids ? (
            <>
              <span className="text-lg">🧒</span>
              <span className="text-[10px] text-pink-500 font-bold">Niños</span>
            </>
          ) : isChemistry ? (
            <>
              <span className="text-lg">🧪</span>
              <span className="text-[10px] text-emerald-500 font-bold">Química</span>
            </>
          ) : (
            <>
              <span className={cn(
                "font-bold text-xs uppercase",
                gameState.difficulty === 'easy' && "text-green-500",
                gameState.difficulty === 'medium' && "text-yellow-500",
                gameState.difficulty === 'hard' && "text-orange-500",
                gameState.difficulty === 'expert' && "text-red-500",
              )}>
                {gameState.difficulty === 'easy' && 'Fácil'}
                {gameState.difficulty === 'medium' && 'Medio'}
                {gameState.difficulty === 'hard' && 'Difícil'}
                {gameState.difficulty === 'expert' && 'Experto'}
              </span>
              <span className="text-[10px] text-gray-400">Dificultad</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
