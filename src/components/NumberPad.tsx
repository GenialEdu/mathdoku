import { useGame } from '@/context/GameContext';
import { cn } from '@/utils/cn';
import { NumberShape } from './KidsShapes';
import { KIDS_SHAPES, CHEMISTRY_ELEMENTS } from '@/types/game';

export function NumberPad() {
  const { 
    gameState, 
    selectedCell, 
    inputNumber, 
    clearCell, 
    toggleNoteMode, 
    isNoteMode,
    requestHint,
    newPuzzleSameLevel,
    restartGame,
    gameMode,
  } = useGame();

  if (!gameState) return null;

  const selectedCellData = selectedCell 
    ? gameState.board[selectedCell.row][selectedCell.col] 
    : null;
  const canInput = selectedCellData && !selectedCellData.isFixed;
  
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const isKids = gameMode === 'kids';
  const isChemistry = gameMode === 'chemistry';

  return (
    <div className="w-full max-w-[360px] sm:max-w-[420px] md:max-w-[480px] mx-auto mt-4">
      {/* Number/Shape buttons */}
      <div className="grid grid-cols-9 gap-1 mb-3">
        {numbers.map(num => {
          const isUsed = selectedCellData?.userAnswer === num;
          const shapeInfo = KIDS_SHAPES[num];
          const element = CHEMISTRY_ELEMENTS[num];
          
          return (
            <button
              key={num}
              onClick={() => canInput && inputNumber(num)}
              disabled={!canInput}
              className={cn(
                "rounded-lg font-bold transition-all duration-150",
                "focus:outline-none focus:ring-2 focus:ring-offset-1",
                "active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed",
                "shadow-md hover:shadow-lg",
                isKids ? "h-12 sm:h-14 focus:ring-pink-500" : isChemistry ? "h-10 sm:h-12 focus:ring-emerald-500" : "h-10 sm:h-12 focus:ring-indigo-500",
                isNoteMode 
                  ? "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 border-2 border-amber-300 dark:border-amber-700"
                  : isUsed
                    ? isKids 
                      ? "border-2 text-white" 
                      : isChemistry
                      ? "bg-emerald-600 text-white"
                      : "bg-indigo-600 text-white"
                    : isKids
                      ? "bg-white dark:bg-gray-800 border-2 hover:scale-105"
                      : isChemistry
                      ? "bg-white dark:bg-gray-800 text-emerald-700 dark:text-emerald-300 border-2 border-emerald-200 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
                      : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30",
              )}
              style={isKids && isUsed ? {
                backgroundColor: shapeInfo.bgColor,
                borderColor: shapeInfo.color,
              } : isKids && !isNoteMode ? {
                borderColor: shapeInfo.bgColor,
              } : undefined}
            >
              {isKids ? (
                <div className="flex items-center justify-center">
                  <NumberShape 
                    value={num} 
                    size={isUsed ? 30 : 26} 
                    showNumber={true}
                    muted={isNoteMode}
                  />
                </div>
              ) : isChemistry ? (
                <span className="text-lg sm:text-xl font-mono font-bold text-green-700 dark:text-green-300">
                  {element?.symbol}
                </span>
              ) : (
                <span className="text-lg sm:text-xl">{num}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-5 gap-2">
        {/* Clear button */}
        <button
          onClick={clearCell}
          disabled={!canInput || selectedCellData?.userAnswer === null}
          className={cn(
            "h-12 sm:h-14 rounded-xl font-semibold text-sm sm:text-base transition-all duration-150",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500",
            "active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed",
            "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400",
            "border-2 border-red-200 dark:border-red-800",
            "hover:bg-red-200 dark:hover:bg-red-800/50 shadow-md"
          )}
        >
          <span className="flex flex-col items-center gap-0.5">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span className="text-xs">Borrar</span>
          </span>
        </button>

        {/* Note mode toggle */}
        <button
          onClick={toggleNoteMode}
          disabled={!canInput}
          className={cn(
            "h-12 sm:h-14 rounded-xl font-semibold text-sm sm:text-base transition-all duration-150",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500",
            "active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-md",
            isNoteMode
              ? "bg-amber-500 text-white border-2 border-amber-600"
              : "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 border-2 border-amber-200 dark:border-amber-800 hover:bg-amber-200 dark:hover:bg-amber-800/50"
          )}
        >
          <span className="flex flex-col items-center gap-0.5">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="text-xs">Notas</span>
          </span>
        </button>

        {/* Hint button */}
        <button
          onClick={requestHint}
          disabled={!canInput}
          className={cn(
            "h-12 sm:h-14 rounded-xl font-semibold text-sm sm:text-base transition-all duration-150",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500",
            "active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed",
            "bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400",
            "border-2 border-purple-200 dark:border-purple-800",
            "hover:bg-purple-200 dark:hover:bg-purple-800/50 shadow-md"
          )}
        >
          <span className="flex flex-col items-center gap-0.5">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span className="text-xs">Pista</span>
          </span>
        </button>

        {/* Restart current puzzle */}
        <button
          onClick={restartGame}
          className={cn(
            "h-12 sm:h-14 rounded-xl font-semibold text-sm sm:text-base transition-all duration-150",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500",
            "active:scale-95 shadow-md",
            "bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400",
            "border-2 border-orange-200 dark:border-orange-800",
            "hover:bg-orange-200 dark:hover:bg-orange-800/50"
          )}
        >
          <span className="flex flex-col items-center gap-0.5">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-xs">Reiniciar</span>
          </span>
        </button>

        {/* New puzzle same level */}
        <button
          onClick={newPuzzleSameLevel}
          className={cn(
            "h-12 sm:h-14 rounded-xl font-semibold text-sm sm:text-base transition-all duration-150",
            "focus:outline-none focus:ring-2 focus:ring-offset-2",
            "active:scale-95 shadow-md",
            isKids
              ? "bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400 border-2 border-pink-200 dark:border-pink-800 hover:bg-pink-200 dark:hover:bg-pink-800/50 focus:ring-pink-500"
              : isChemistry
              ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 border-2 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-200 dark:hover:bg-emerald-800/50 focus:ring-emerald-500"
              : "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-200 dark:hover:bg-indigo-800/50 focus:ring-indigo-500"
          )}
        >
          <span className="flex flex-col items-center gap-0.5">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-xs">Nuevo</span>
          </span>
        </button>
      </div>

      {/* Tip */}
      <div className={cn(
        "mt-3 p-2 rounded-xl text-center",
        isKids ? "bg-pink-50 dark:bg-pink-900/20" : isChemistry ? "bg-emerald-50 dark:bg-emerald-900/20" : "bg-gray-100 dark:bg-gray-800"
      )}>
        <span className={cn(
          "text-xs",
          isKids ? "text-pink-500 dark:text-pink-400" : isChemistry ? "text-emerald-500 dark:text-emerald-400" : "text-gray-500 dark:text-gray-400"
        )}>
          {isKids 
            ? "🎨 Coloca la figura correcta en cada celda. ¡Cada figura aparece una sola vez por fila, columna y región!"
            : isChemistry
            ? "🧪 Coloca el elemento correcto. Cada símbolo químico aparece una vez por fila, columna y región 3x3."
            : "💡 ¿Necesitas ayuda? Usa el botón Pista y resuelve un acertijo"
          }
        </span>
      </div>
    </div>
  );
}
