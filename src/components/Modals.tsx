import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { cn } from '@/utils/cn';
import { GameMode, DifficultySettings, MathDifficulty, PuzzleDifficulty } from '@/types/game';
import { NumberShape, ShapeLegend } from './KidsShapes';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  showCloseButton?: boolean;
}

function Modal({ isOpen, onClose, children, title, showCloseButton = true }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden animate-slideUp">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">{title}</h2>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
          {children}
        </div>
      </div>
    </div>
  );
}

// Welcome Modal
interface WelcomeModalProps {
  isOpen: boolean;
  onComplete: (nickname: string, mode: GameMode) => void;
}

export function WelcomeModal({ isOpen, onComplete }: WelcomeModalProps) {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [selectedMode, setSelectedMode] = useState<GameMode>('math');

  const handleSubmit = () => {
    const trimmedName = nickname.trim();
    if (trimmedName.length < 2) {
      setError('El nombre debe tener al menos 2 caracteres');
      return;
    }
    if (trimmedName.length > 20) {
      setError('El nombre no puede tener más de 20 caracteres');
      return;
    }
    onComplete(trimmedName, selectedMode);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6 animate-slideUp max-h-[95vh] overflow-y-auto">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🧮</div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            MathDoku Quest
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Sudoku Matemático Interactivo
          </p>
        </div>

        {/* Nickname */}
        <div className="mb-5">
          <p className="text-center text-gray-700 dark:text-gray-300 mb-3">
            ¡Bienvenido! ¿Cómo te gustaría que te llamemos?
          </p>
          <input
            type="text"
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value);
              setError('');
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Tu nombre o apodo..."
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-lg text-center focus:border-indigo-500 focus:outline-none transition-colors"
            autoFocus
            maxLength={20}
          />
          {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error}</p>
          )}
        </div>

        {/* Game Mode Selection */}
        <div className="mb-5">
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm mb-3 font-semibold">
            Elige tu modo de juego:
          </p>
          <div className="grid grid-cols-3 gap-3">
            {/* Math Mode */}
            <button
              onClick={() => setSelectedMode('math')}
              className={cn(
                "p-4 rounded-xl border-3 transition-all text-center",
                selectedMode === 'math'
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 shadow-lg scale-[1.02]"
                  : "border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600"
              )}
            >
              <div className="text-3xl mb-2">🧮</div>
              <div className="font-bold text-gray-800 dark:text-white text-sm">Matemático</div>
              <div className="text-[10px] text-gray-500 mt-1">
                Expresiones y operaciones matemáticas
              </div>
              <div className="mt-2 flex justify-center gap-1">
                <span className="text-xs bg-indigo-100 dark:bg-indigo-800 px-1.5 py-0.5 rounded text-indigo-700 dark:text-indigo-300">2+1</span>
                <span className="text-xs bg-indigo-100 dark:bg-indigo-800 px-1.5 py-0.5 rounded text-indigo-700 dark:text-indigo-300">√9</span>
                <span className="text-xs bg-indigo-100 dark:bg-indigo-800 px-1.5 py-0.5 rounded text-indigo-700 dark:text-indigo-300">4÷2</span>
              </div>
            </button>

            {/* Kids Mode */}
            <button
              onClick={() => setSelectedMode('kids')}
              className={cn(
                "p-4 rounded-xl border-3 transition-all text-center",
                selectedMode === 'kids'
                  ? "border-pink-500 bg-pink-50 dark:bg-pink-900/30 shadow-lg scale-[1.02]"
                  : "border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-600"
              )}
            >
              <div className="text-3xl mb-2">🎨</div>
              <div className="font-bold text-gray-800 dark:text-white text-sm">Para Niños</div>
              <div className="text-[10px] text-gray-500 mt-1">
                Figuras de colores con números
              </div>
              <div className="mt-2 flex justify-center gap-1 items-center">
                <NumberShape value={1} size={20} />
                <NumberShape value={2} size={20} />
                <NumberShape value={3} size={20} />
              </div>
            </button>

            {/* Chemistry Mode */}
            <button
              onClick={() => setSelectedMode('chemistry')}
              className={cn(
                "p-4 rounded-xl border-3 transition-all text-center",
                selectedMode === 'chemistry'
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 shadow-lg scale-[1.02]"
                  : "border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600"
              )}
            >
              <div className="text-3xl mb-2">🧪</div>
              <div className="font-bold text-gray-800 dark:text-white text-sm">Química</div>
              <div className="text-[10px] text-gray-500 mt-1">
                Tabla periódica y elementos
              </div>
              <div className="mt-2 flex justify-center gap-1">
                <span className="text-xs bg-emerald-100 dark:bg-emerald-800 px-1.5 py-0.5 rounded text-emerald-700 dark:text-emerald-300">H</span>
                <span className="text-xs bg-emerald-100 dark:bg-emerald-800 px-1.5 py-0.5 rounded text-emerald-700 dark:text-emerald-300">He</span>
                <span className="text-xs bg-emerald-100 dark:bg-emerald-800 px-1.5 py-0.5 rounded text-emerald-700 dark:text-emerald-300">Li</span>
              </div>
            </button>
          </div>
        </div>

        {/* Kids mode shape preview / Chemistry mode preview */}
        {selectedMode === 'kids' && (
          <div className="mb-4 p-3 rounded-xl bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800">
            <p className="text-xs text-pink-600 dark:text-pink-400 text-center font-semibold mb-2">
              🎨 Cada número es una figura de color diferente:
            </p>
            <ShapeLegend compact={false} />
          </div>
        )}
        {selectedMode === 'chemistry' && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            <p className="text-xs text-emerald-600 dark:text-emerald-400 text-center font-semibold mb-2">
              🧪 Cada número es un elemento de la tabla periódica:
            </p>
            <div className="flex flex-wrap justify-center gap-1">
              {[1,2,3,4,5,6,7,8,9].map(n => (
                <span key={n} className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center font-mono text-sm text-emerald-700 dark:text-emerald-300 border border-emerald-300">
                  {['H','He','Li','Be','B','C','N','O','F'][n-1]}
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!nickname.trim()}
          className={cn(
            "w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
            selectedMode === 'kids'
              ? "bg-gradient-to-r from-pink-500 to-orange-500"
              : selectedMode === 'chemistry'
              ? "bg-gradient-to-r from-emerald-500 to-teal-500"
              : "bg-gradient-to-r from-indigo-500 to-purple-500"
          )}
        >
          {selectedMode === 'kids' ? '¡A Jugar con Figuras! 🎨' : 
           selectedMode === 'chemistry' ? '¡A Jugar con Elementos! 🧪' : '¡Comenzar a Jugar! 🎮'}
        </button>

        <p className="text-center text-xs text-gray-400 mt-4">
          Para jugadores de 10 años en adelante
        </p>
      </div>
    </div>
  );
}

// Menu Modal
interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewGame: () => void;
  onStats: () => void;
  onSavedGames: () => void;
  onAchievements: () => void;
}

export function MenuModal({ isOpen, onClose, onNewGame, onStats, onSavedGames, onAchievements }: MenuModalProps) {
  const { restartGame, saveGame, newPuzzleSameLevel, playerProfile, gameState, gameMode, setGameMode, newGame } = useGame();
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [saveName, setSaveName] = useState('');

  const handleSave = () => {
    if (saveName.trim()) {
      saveGame(saveName.trim());
      setSaveName('');
      setShowSaveInput(false);
      onClose();
    }
  };

  const isKids = gameMode === 'kids';
  const isChemistry = gameMode === 'chemistry';

  const otherModes: { mode: GameMode; icon: string; label: string }[] = [];
  if (gameMode !== 'math') otherModes.push({ mode: 'math', icon: '🧮', label: 'Matemático' });
  if (gameMode !== 'kids') otherModes.push({ mode: 'kids', icon: '🎨', label: 'Niños' });
  if (gameMode !== 'chemistry') otherModes.push({ mode: 'chemistry', icon: '🧪', label: 'Química' });

  const menuItems = [
    ...otherModes.map(m => ({
      icon: m.icon,
      label: `Cambiar a modo ${m.label}`,
      action: () => {
        setGameMode(m.mode);
        newGame(gameState?.level || 1, m.mode);
        onClose();
      }
    })),
    { icon: '🎮', label: 'Nuevo Juego (Otro Nivel)', action: () => { onNewGame(); onClose(); } },
    { icon: '🎮', label: 'Nuevo Juego (Otro Nivel)', action: () => { onNewGame(); onClose(); } },
    { icon: '🔄', label: `Nuevo Sudoku (Nivel ${gameState?.level || 1})`, action: () => { newPuzzleSameLevel(); onClose(); } },
    { icon: '↩️', label: 'Reiniciar Este Sudoku', action: () => { restartGame(); onClose(); } },
    { icon: '💾', label: 'Guardar Partida', action: () => setShowSaveInput(true) },
    { icon: '📂', label: 'Cargar Partida', action: () => { onSavedGames(); onClose(); } },
    { icon: '📊', label: 'Estadísticas', action: () => { onStats(); onClose(); } },
    { icon: '🏆', label: 'Logros y Trofeos', action: () => { onAchievements(); onClose(); } },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={playerProfile ? `Menú - ${playerProfile.nickname}` : 'Menú'}>
      {showSaveInput ? (
        <div className="space-y-4">
          <input
            type="text"
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            placeholder="Nombre de la partida..."
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-indigo-500 focus:outline-none"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={() => setShowSaveInput(false)}
              className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-semibold"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={!saveName.trim()}
              className="flex-1 py-3 rounded-xl bg-indigo-500 text-white font-semibold disabled:opacity-50"
            >
              Guardar
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className={cn(
                "w-full flex items-center gap-3 p-4 rounded-xl transition-colors text-left",
                index === 0 
                  ? isKids 
                    ? "bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 border-2 border-indigo-200 dark:border-indigo-800"
                    : "bg-pink-50 dark:bg-pink-900/20 hover:bg-pink-100 dark:hover:bg-pink-900/40 border-2 border-pink-200 dark:border-pink-800"
                  : "bg-gray-50 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
              )}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="font-semibold text-gray-800 dark:text-white">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </Modal>
  );
}

// New Game Modal
interface NewGameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewGameModal({ isOpen, onClose }: NewGameModalProps) {
  const { newGame, gameState, playerProfile, gameMode } = useGame();
  const [selectedLevel, setSelectedLevel] = useState(gameState?.level || 1);
  const isKids = gameMode === 'kids';

  const levelRanges = isKids ? [
    { start: 1, end: 5, name: 'Principiante', desc: 'Muchas pistas para empezar', color: 'green' },
    { start: 6, end: 10, name: 'Aprendiz', desc: 'Menos pistas, más diversión', color: 'blue' },
    { start: 11, end: 15, name: 'Explorador', desc: 'Desafío intermedio', color: 'purple' },
    { start: 16, end: 20, name: 'Aventurero', desc: 'Para los valientes', color: 'orange' },
    { start: 21, end: 25, name: 'Maestro', desc: 'Casi experto', color: 'red' },
    { start: 26, end: 30, name: 'Campeón', desc: '¡El máximo desafío!', color: 'pink' },
  ] : [
    { start: 1, end: 5, name: 'Enteros Positivos', desc: '1, 2, 3... 9', color: 'green' },
    { start: 6, end: 10, name: 'Enteros Negativos', desc: 'Con operaciones negativas', color: 'blue' },
    { start: 11, end: 15, name: 'Fracciones', desc: '½, ¾, ⅓...', color: 'purple' },
    { start: 16, end: 20, name: 'Decimales y %', desc: '0.5, 50%...', color: 'orange' },
    { start: 21, end: 25, name: 'Raíces y Potencias', desc: '√4, 2²...', color: 'red' },
    { start: 26, end: 30, name: 'Combinaciones', desc: 'Todo combinado', color: 'pink' },
  ];

  const handleStart = () => {
    newGame(selectedLevel);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={playerProfile ? `${playerProfile.nickname}, elige tu nivel` : 'Nuevo Juego'}>
      <div className="space-y-4">
        {/* Mode indicator */}
        <div className={cn(
          "text-center p-2 rounded-xl text-sm font-semibold",
          isKids ? "bg-pink-100 dark:bg-pink-900/30 text-pink-600" : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600"
        )}>
          {isKids ? '🎨 Modo Niños - Figuras de Colores' : '🧮 Modo Matemático - Expresiones'}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            Selecciona el Nivel: {selectedLevel}
          </label>
          <input
            type="range"
            min="1"
            max="30"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(Number(e.target.value))}
            className={cn(
              "w-full h-2 rounded-lg appearance-none cursor-pointer",
              isKids ? "accent-pink-500" : "accent-indigo-500"
            )}
          />
        </div>

        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {levelRanges.map((range) => {
            const isSelected = selectedLevel >= range.start && selectedLevel <= range.end;
            return (
              <button
                key={range.start}
                onClick={() => setSelectedLevel(range.start)}
                className={cn(
                  "w-full p-3 rounded-xl border-2 text-left transition-all",
                  isSelected 
                    ? isKids
                      ? "border-pink-500 bg-pink-50 dark:bg-pink-900/30"
                      : "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30"
                    : "border-gray-200 dark:border-gray-700 hover:border-indigo-300"
                )}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-gray-800 dark:text-white">{range.name}</div>
                    <div className="text-sm text-gray-500">{range.desc}</div>
                  </div>
                  <div className={cn(
                    "text-sm font-semibold",
                    isKids ? "text-pink-500" : "text-indigo-500"
                  )}>
                    Nivel {range.start}-{range.end}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleStart}
          className={cn(
            "w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-[0.98]",
            isKids
              ? "bg-gradient-to-r from-pink-500 to-orange-500"
              : "bg-gradient-to-r from-indigo-500 to-purple-500"
          )}
        >
          ¡Comenzar Nivel {selectedLevel}!
        </button>
      </div>
    </Modal>
  );
}

// Stats Modal
interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StatsModal({ isOpen, onClose }: StatsModalProps) {
  const { stats, playerProfile } = useGame();

  const statItems = [
    { label: 'Partidas Jugadas', value: stats.gamesPlayed, icon: '🎮' },
    { label: 'Partidas Ganadas', value: stats.gamesWon, icon: '✅' },
    { label: 'Racha Actual', value: stats.currentStreak, icon: '🔥' },
    { label: 'Mejor Racha', value: stats.bestStreak, icon: '⭐' },
    { label: 'Total Errores', value: stats.totalErrors, icon: '❌' },
    { label: 'Niveles Completados', value: stats.levelsCompleted.length, icon: '📈' },
    { label: 'XP Total', value: stats.xp, icon: '💎' },
    { label: 'Rango', value: stats.rank, icon: '🏅' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={playerProfile ? `Estadísticas de ${playerProfile.nickname}` : 'Estadísticas'}>
      <div className="space-y-3">
        <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-center">
          <div className="text-4xl mb-2">🏅</div>
          <div className="text-2xl font-bold">{stats.rank}</div>
          <div className="text-sm opacity-80">{stats.xp} XP</div>
          <div className="mt-2 h-2 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${Math.min(100, (stats.xp % 1000) / 10)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {statItems.map((item, index) => (
            <div
              key={index}
              className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-center"
            >
              <div className="text-2xl mb-1">{item.icon}</div>
              <div className="text-xl font-bold text-gray-800 dark:text-white">{item.value}</div>
              <div className="text-xs text-gray-500">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

// Saved Games Modal
interface SavedGamesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SavedGamesModal({ isOpen, onClose }: SavedGamesModalProps) {
  const { savedGames, loadGame, deleteSavedGame, playerProfile } = useGame();

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('es', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={playerProfile ? `Partidas de ${playerProfile.nickname}` : 'Partidas Guardadas'}>
      {savedGames.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📂</div>
          <p>{playerProfile?.nickname}, no tienes partidas guardadas</p>
        </div>
      ) : (
        <div className="space-y-2">
          {savedGames.map((game) => (
            <div
              key={game.id}
              className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                  {game.gameState.gameMode === 'kids' ? '🎨' : '🧮'}
                  {game.name}
                </div>
                <div className="text-xs text-gray-500">
                  Nivel {game.gameState.level} • {game.gameState.gameMode === 'kids' ? 'Niños' : 'Matemático'} • {formatDate(game.savedAt)}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { loadGame(game); onClose(); }}
                  className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <button
                  onClick={() => deleteSavedGame(game.id)}
                  className="p-2 rounded-lg bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}

// Hint Puzzle Modal
export function HintPuzzleModal() {
  const { showHintPuzzle, hintPuzzle, answerHintPuzzle, cancelHintPuzzle, playerProfile, gameMode } = useGame();
  const isKids = gameMode === 'kids';
  const isChemistry = gameMode === 'chemistry';

  if (!showHintPuzzle || !hintPuzzle) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-slideUp">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">{isKids ? '🧩' : isChemistry ? '🧪' : '🧩'}</div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
            {playerProfile?.nickname}, ¡resuelve para obtener la pista!
          </h3>
          <p className={cn(
            "text-xl font-semibold",
            isKids ? "text-pink-600 dark:text-pink-400" : isChemistry ? "text-green-600 dark:text-green-400" : "text-indigo-600 dark:text-indigo-400"
          )}>
            {hintPuzzle.question}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {hintPuzzle.options.map((option) => (
            <button
              key={option}
              onClick={() => answerHintPuzzle(option)}
              className={cn(
                "py-4 rounded-xl text-xl font-bold transition-colors active:scale-95",
                isKids
                  ? "bg-pink-50 dark:bg-pink-900/20 text-gray-800 dark:text-white hover:bg-pink-100 dark:hover:bg-pink-900/40"
                  : isChemistry
                  ? "bg-green-50 dark:bg-green-900/20 text-gray-800 dark:text-white hover:bg-green-100 dark:hover:bg-green-900/40"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
              )}
            >
              {option}
            </button>
          ))}
        </div>

        <button
          onClick={cancelHintPuzzle}
          className="w-full py-3 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 font-semibold"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

// Victory Modal
interface VictoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewGame: () => void;
}

export function VictoryModal({ isOpen, onClose, onNewGame }: VictoryModalProps) {
  const { gameState, stats, playerProfile, newPuzzleSameLevel, gameMode } = useGame();
  const isKids = gameMode === 'kids';
  const isChemistry = gameMode === 'chemistry';

  if (!isOpen || !gameState) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-slideUp text-center">
        <div className="text-6xl mb-4 animate-bounce">{isKids ? '🌟' : isChemistry ? '🧪' : '🎉'}</div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          {isKids ? '¡Increíble' : '¡Felicitaciones'}{playerProfile ? `, ${playerProfile.nickname}` : ''}!
        </h2>
        <p className="text-gray-500 mb-6">
          Has completado el Nivel {gameState.level} {isKids ? '🎨' : isChemistry ? '🧪' : '🧮'}
        </p>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800">
            <div className="text-xl font-bold text-indigo-600">{formatTime(gameState.elapsedTime)}</div>
            <div className="text-xs text-gray-500">Tiempo</div>
          </div>
          <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800">
            <div className="text-xl font-bold text-red-500">{gameState.errors}</div>
            <div className="text-xs text-gray-500">Errores</div>
          </div>
          <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800">
            <div className="text-xl font-bold text-purple-500">{gameState.hintsUsed}</div>
            <div className="text-xs text-gray-500">Pistas</div>
          </div>
        </div>

        <div className={cn(
          "p-3 rounded-xl text-white mb-6",
          isKids ? "bg-gradient-to-r from-pink-500 to-orange-500" : isChemistry ? "bg-gradient-to-r from-emerald-500 to-teal-500" : "bg-gradient-to-r from-indigo-500 to-purple-500"
        )}>
          <div className="text-sm opacity-80">Racha actual</div>
          <div className="text-2xl font-bold">🔥 {stats.currentStreak}</div>
        </div>

        <div className="space-y-2">
          <button
            onClick={onNewGame}
            className={cn(
              "w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg",
              isKids ? "bg-gradient-to-r from-pink-500 to-orange-500" : isChemistry ? "bg-gradient-to-r from-emerald-500 to-teal-500" : "bg-gradient-to-r from-indigo-500 to-purple-500"
            )}
          >
            Siguiente Nivel ⬆️
          </button>
          <button
            onClick={() => { newPuzzleSameLevel(); onClose(); }}
            className={cn(
              "w-full py-3 rounded-xl font-semibold",
              isKids
                ? "bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400"
                : isChemistry
                ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400"
                : "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400"
            )}
          >
            Otro Sudoku del mismo Nivel 🔄
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-semibold"
          >
            Volver al Menú
          </button>
        </div>
      </div>
    </div>
  );
}

// Settings Modal
interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, updateSettings, exportData, importData, playerProfile } = useGame();
  const [showExport, setShowExport] = useState(false);
  const [exportedData, setExportedData] = useState('');
  const [importInput, setImportInput] = useState('');

  const handleExport = () => {
    const data = exportData();
    setExportedData(data);
    setShowExport(true);
  };

  const handleImport = () => {
    if (importData(importInput)) {
      setImportInput('');
      onClose();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(exportedData);
  };

  const handleDownload = () => {
    const blob = new Blob([exportedData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mathdoku-backup-${playerProfile?.nickname || 'jugador'}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Configuración">
      {showExport ? (
        <div className="space-y-4">
          <textarea
            value={exportedData}
            readOnly
            className="w-full h-32 p-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-mono"
          />
          <div className="flex gap-2">
            <button onClick={handleCopy} className="flex-1 py-3 rounded-xl bg-indigo-500 text-white font-semibold">
              📋 Copiar
            </button>
            <button onClick={handleDownload} className="flex-1 py-3 rounded-xl bg-green-500 text-white font-semibold">
              💾 Descargar
            </button>
          </div>
          <button onClick={() => setShowExport(false)} className="w-full py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-semibold">
            Volver
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Theme */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
            <span className="font-semibold text-gray-800 dark:text-white">Tema</span>
            <select
              value={settings.theme}
              onChange={(e) => updateSettings({ theme: e.target.value as 'light' | 'dark' | 'auto' })}
              className="px-3 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
            >
              <option value="auto">Automático</option>
              <option value="light">Claro</option>
              <option value="dark">Oscuro</option>
            </select>
          </div>

          {/* Toggles */}
          {[
            { key: 'showTimer', label: 'Mostrar temporizador' },
            { key: 'autoCheckErrors', label: 'Verificar errores automáticamente' },
            { key: 'highlightSameNumbers', label: 'Resaltar números iguales' },
            { key: 'soundEnabled', label: 'Efectos de sonido' },
            { key: 'musicEnabled', label: 'Música de fondo' },
            { key: 'vibrationEnabled', label: 'Vibración' },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
              <span className="font-semibold text-gray-800 dark:text-white">{label}</span>
              <button
                onClick={() => updateSettings({ [key]: !settings[key as keyof typeof settings] })}
                className={cn(
                  "w-12 h-7 rounded-full transition-colors relative",
                  settings[key as keyof typeof settings] ? "bg-indigo-500" : "bg-gray-300"
                )}
              >
                <div className={cn(
                  "w-5 h-5 bg-white rounded-full absolute top-1 transition-transform",
                  settings[key as keyof typeof settings] ? "translate-x-6" : "translate-x-1"
                )} />
              </button>
            </div>
          ))}

          {/* Manual Difficulty */}
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-indigo-200 dark:border-indigo-800">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-gray-800 dark:text-white">Dificultad manual</span>
              <button
                onClick={() => updateSettings({ manualDifficulty: !settings.manualDifficulty })}
                className={cn(
                  "w-12 h-7 rounded-full transition-colors relative",
                  settings.manualDifficulty ? "bg-indigo-500" : "bg-gray-300"
                )}
              >
                <div className={cn(
                  "w-5 h-5 bg-white rounded-full absolute top-1 transition-transform",
                  settings.manualDifficulty ? "translate-x-6" : "translate-x-1"
                )} />
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Desactiva para usar la progresión automática por niveles
            </p>
            
            {settings.manualDifficulty && (
              <div className="space-y-3" data-animate="slideDown">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Dificultad matemática (expresiones)
                  </label>
                  <select
                    value={settings.difficulty.math}
                    onChange={(e) => updateSettings({ 
                      difficulty: { ...settings.difficulty, math: e.target.value as MathDifficulty } 
                    })}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                  >
                    <option value="basic">Básico (sumas, restas simples)</option>
                    <option value="intermediate">Intermedio (×, ÷, negativos)</option>
                    <option value="advanced">Avanzado (fracciones, decimales, %) </option>
                    <option value="expert">Experto (potencias, raíces, algebra)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Dificultad del puzzle (celdas reveladas)
                  </label>
                  <select
                    value={settings.difficulty.puzzle}
                    onChange={(e) => updateSettings({ 
                      difficulty: { ...settings.difficulty, puzzle: e.target.value as PuzzleDifficulty } 
                    })}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                  >
                    <option value="easy">Fácil (50 celdas)</option>
                    <option value="medium">Medio (40 celdas)</option>
                    <option value="hard">Difícil (30 celdas)</option>
                    <option value="expert">Experto (22 celdas)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Export/Import */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Datos</h3>
            <div className="flex gap-2 mb-3">
              <button onClick={handleExport} className="flex-1 py-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-semibold">
                📤 Exportar
              </button>
            </div>
            <div className="space-y-2">
              <input
                type="text"
                value={importInput}
                onChange={(e) => setImportInput(e.target.value)}
                placeholder="Pegar datos de respaldo..."
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              />
              <button
                onClick={handleImport}
                disabled={!importInput.trim()}
                className="w-full py-3 rounded-xl bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 font-semibold disabled:opacity-50"
              >
                📥 Importar
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

// Game Over Modal
interface GameOverModalProps {
  isOpen: boolean;
  onNewGame: () => void;
  onQuit: () => void;
}

export function GameOverModal({ isOpen, onNewGame, onQuit }: GameOverModalProps) {
  const { gameState, playerProfile, newPuzzleSameLevel, gameMode } = useGame();
  const [showInvite, setShowInvite] = useState(false);
  const isKids = gameMode === 'kids';
  const isChemistry = gameMode === 'chemistry';

  if (!isOpen || !gameState) return null;

  const handleQuit = () => {
    setShowInvite(true);
  };

  const handleConfirmQuit = () => {
    setShowInvite(false);
    onQuit();
  };

  const handleContinuePlaying = () => {
    setShowInvite(false);
    newPuzzleSameLevel();
    onNewGame();
  };

  if (showInvite) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-slideUp text-center">
          <div className="text-6xl mb-4">🎮</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            {playerProfile ? `${playerProfile.nickname}, ` : ''}¿Ya te vas?
          </h2>
          <p className="text-gray-500 mb-6">
            {isKids
              ? '¡Espera! Hay muchas más figuras por descubrir. ¿Intentamos uno más?'
              : isChemistry
              ? '¡Espera! Hay muchos más elementos por descubrir. ¿Intentamos uno más?'
              : '¡Espera! Hay muchos más sudokus por resolver. ¿Qué tal intentar uno más?'
            }
          </p>

          <div className="space-y-3">
            <button
              onClick={handleContinuePlaying}
              className={cn(
                "w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg",
                isKids ? "bg-gradient-to-r from-pink-500 to-orange-500" : isChemistry ? "bg-gradient-to-r from-emerald-500 to-teal-500" : "bg-gradient-to-r from-indigo-500 to-purple-500"
              )}
            >
              ¡Sí, un juego más! 🎯
            </button>
            <button
              onClick={handleConfirmQuit}
              className="w-full py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-semibold"
            >
              No, terminar por ahora
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-slideUp text-center">
        <div className="text-6xl mb-4">{isKids ? '😿' : '😢'}</div>
        <h2 className="text-2xl font-bold text-red-500 mb-2">
          Game Over
        </h2>
        <p className="text-gray-500 mb-2">
          {playerProfile ? `${playerProfile.nickname}, has` : 'Has'} cometido 3 errores
        </p>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          {isKids
            ? '¡No te preocupes! Cada intento te hace más fuerte. 💪'
            : '¡No te rindas! La práctica hace al maestro.'
          }
        </p>

        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 mb-6">
          <div className="text-sm text-red-600 dark:text-red-400">
            Nivel {gameState.level} • {gameState.errors} errores • {gameState.hintsUsed} pistas usadas
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => { newPuzzleSameLevel(); onNewGame(); }}
            className={cn(
              "w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg",
              isKids ? "bg-gradient-to-r from-pink-500 to-orange-500" : "bg-gradient-to-r from-indigo-500 to-purple-500"
            )}
          >
            🔄 Nuevo Juego
          </button>
          <button
            onClick={handleQuit}
            className="w-full py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-semibold"
          >
            Terminar de jugar
          </button>
        </div>
      </div>
    </div>
  );
}

// Achievements Modal
interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AchievementsModal({ isOpen, onClose }: AchievementsModalProps) {
  const { stats, playerProfile } = useGame();

  const allAchievements = [
    { id: '1', icon: '🎯', title: 'Primera Victoria', desc: 'Completa tu primer puzzle', unlocked: stats.gamesWon >= 1 },
    { id: '2', icon: '🔥', title: 'En Racha', desc: 'Gana 3 partidas seguidas', unlocked: stats.bestStreak >= 3 },
    { id: '3', icon: '⚡', title: 'Imparable', desc: 'Gana 5 partidas seguidas', unlocked: stats.bestStreak >= 5 },
    { id: '4', icon: '🧠', title: 'Mente Brillante', desc: 'Gana 10 partidas seguidas', unlocked: stats.bestStreak >= 10 },
    { id: '5', icon: '📚', title: 'Estudiante', desc: 'Completa 10 puzzles', unlocked: stats.gamesWon >= 10 },
    { id: '6', icon: '🎓', title: 'Graduado', desc: 'Completa 25 puzzles', unlocked: stats.gamesWon >= 25 },
    { id: '7', icon: '🏆', title: 'Maestro', desc: 'Completa 50 puzzles', unlocked: stats.gamesWon >= 50 },
    { id: '8', icon: '💪', title: 'Nivel 10', desc: 'Alcanza el nivel 10', unlocked: stats.levelsCompleted.some(l => l >= 10) },
    { id: '9', icon: '🚀', title: 'Nivel 20', desc: 'Alcanza el nivel 20', unlocked: stats.levelsCompleted.some(l => l >= 20) },
    { id: '10', icon: '👑', title: 'Nivel 30', desc: 'Alcanza el nivel 30', unlocked: stats.levelsCompleted.some(l => l >= 30) },
    { id: '11', icon: '💎', title: 'Coleccionista', desc: 'Acumula 1000 XP', unlocked: stats.xp >= 1000 },
    { id: '12', icon: '🌟', title: 'Leyenda', desc: 'Acumula 5000 XP', unlocked: stats.xp >= 5000 },
  ];

  const unlockedCount = allAchievements.filter(a => a.unlocked).length;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={playerProfile ? `Logros de ${playerProfile.nickname}` : 'Logros y Trofeos'}>
      <div className="space-y-4">
        <div className="text-center p-4 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
          <div className="text-3xl mb-1">🏆</div>
          <div className="text-2xl font-bold">{unlockedCount} / {allAchievements.length}</div>
          <div className="text-sm opacity-80">
            {playerProfile?.nickname}, has desbloqueado {unlockedCount} logros
          </div>
        </div>

        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {allAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className={cn(
                "p-3 rounded-xl flex items-center gap-3 transition-all",
                achievement.unlocked
                  ? "bg-green-50 dark:bg-green-900/30"
                  : "bg-gray-100 dark:bg-gray-800 opacity-60"
              )}
            >
              <div className={cn(
                "text-3xl",
                !achievement.unlocked && "grayscale"
              )}>
                {achievement.icon}
              </div>
              <div className="flex-1">
                <div className={cn(
                  "font-bold",
                  achievement.unlocked ? "text-gray-800 dark:text-white" : "text-gray-500"
                )}>
                  {achievement.title}
                </div>
                <div className="text-sm text-gray-500">{achievement.desc}</div>
              </div>
              {achievement.unlocked && (
                <div className="text-green-500 text-xl">✓</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
