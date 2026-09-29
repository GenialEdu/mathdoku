import React from 'react';
import { useGame } from '@/context/GameContext';
import { cn } from '@/utils/cn';
import { NumberShape } from './KidsShapes';
import { CHEMISTRY_ELEMENTS } from '@/types/game';

interface CellProps {
  row: number;
  col: number;
}

function GameCell({ row, col }: CellProps) {
  const { gameState, selectedCell, selectCell, settings, gameMode } = useGame();
  
  if (!gameState) return null;
  
  const cell = gameState.board[row][col];
  const isSelected = selectedCell?.row === row && selectedCell?.col === col;
  const isSameRow = selectedCell?.row === row;
  const isSameCol = selectedCell?.col === col;
  const isSameBox = selectedCell && 
    Math.floor(selectedCell.row / 3) === Math.floor(row / 3) &&
    Math.floor(selectedCell.col / 3) === Math.floor(col / 3);
  const isHighlighted = !isSelected && (isSameRow || isSameCol || isSameBox);
  
  const selectedCellData = selectedCell ? gameState.board[selectedCell.row][selectedCell.col] : null;
  const selectedValue = selectedCellData?.isFixed 
    ? selectedCellData.value 
    : selectedCellData?.userAnswer;
  const currentValue = cell.isFixed ? cell.value : cell.userAnswer;
  const isSameNumber = settings.highlightSameNumbers && 
    selectedValue !== null && 
    currentValue !== null && 
    selectedValue === currentValue &&
    !isSelected;

  const isRightBorderThick = col === 2 || col === 5;
  const isBottomBorderThick = row === 2 || row === 5;

  const isKids = gameMode === 'kids';
  const isChemistry = gameMode === 'chemistry';

  return (
    <button
      onClick={() => selectCell(row, col)}
      className={cn(
        "aspect-square flex items-center justify-center transition-all duration-150 relative",
        "select-none focus:outline-none focus:ring-2 focus:ring-inset",
        isKids ? "focus:ring-pink-400" : isChemistry ? "focus:ring-green-400" : "focus:ring-indigo-400",
        // Border styles for 3x3 boxes
        "border-r border-b",
        isKids ? "border-pink-200 dark:border-pink-800" : isChemistry ? "border-emerald-200 dark:border-emerald-800" : "border-gray-300 dark:border-gray-600",
        isRightBorderThick && (isKids 
          ? "border-r-2 border-r-pink-500 dark:border-r-pink-400"
          : isChemistry
          ? "border-r-2 border-r-emerald-500 dark:border-r-emerald-400"
          : "border-r-2 border-r-indigo-500 dark:border-r-indigo-400"),
        isBottomBorderThick && (isKids
          ? "border-b-2 border-b-pink-500 dark:border-b-pink-400"
          : isChemistry
          ? "border-b-2 border-b-emerald-500 dark:border-b-emerald-400"
          : "border-b-2 border-b-indigo-500 dark:border-b-indigo-400"),
        // Selection states
        isSelected && (isKids
          ? "bg-pink-400 text-white scale-[1.02] z-10 shadow-lg"
          : isChemistry
          ? "bg-emerald-500 text-white scale-[1.02] z-10 shadow-lg"
          : "bg-indigo-500 text-white scale-[1.02] z-10 shadow-lg"),
        !isSelected && isHighlighted && (isKids
          ? "bg-pink-50 dark:bg-pink-900/20"
          : isChemistry
          ? "bg-green-50/50 dark:bg-green-900/10"
          : "bg-indigo-100 dark:bg-indigo-900/30"),
        !isSelected && isSameNumber && "bg-yellow-200 dark:bg-yellow-800/40",
        !isSelected && !isHighlighted && !isSameNumber && "bg-white dark:bg-gray-800",
        // Cell states (math mode text colors)
        !isKids && !isChemistry && cell.isFixed && !isSelected && "text-gray-800 dark:text-gray-200",
        !isKids && !isChemistry && !cell.isFixed && cell.isCorrect === true && !isSelected && "text-blue-600 dark:text-blue-400",
        !isKids && !isChemistry && !cell.isFixed && cell.isCorrect === false && !isSelected && "text-red-600 dark:text-red-400 animate-shake",
        !isKids && !isChemistry && !cell.isFixed && cell.userAnswer === null && !isSelected && "text-gray-400",
        // Hover
        !isSelected && (isKids
          ? "hover:bg-pink-100 dark:hover:bg-pink-800/30"
          : isChemistry
          ? "hover:bg-green-100 dark:hover:bg-green-800/30"
          : "hover:bg-indigo-200 dark:hover:bg-indigo-800/40"),
      )}
      aria-label={`Celda ${row + 1}, ${col + 1}${currentValue ? `, valor ${currentValue}` : ', vacía'}`}
    >
      {/* KIDS MODE: Fixed cell with colored shape */}
      {isKids && cell.isFixed && cell.value !== null && (
        <NumberShape 
          value={cell.value} 
          size={isSelected ? 28 : 26}
          showNumber={true}
        />
      )}
      
      {/* KIDS MODE: User answer with colored shape */}
      {isKids && !cell.isFixed && cell.userAnswer !== null && (
        <div className={cn(
          "relative",
          cell.isCorrect === false && "animate-shake"
        )}>
          <NumberShape 
            value={cell.userAnswer} 
            size={isSelected ? 28 : 26}
            showNumber={true}
            muted={cell.isCorrect === false}
          />
          {cell.isCorrect === false && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-[7px] text-white font-bold">✕</span>
            </div>
          )}
        </div>
      )}

      {/* KIDS MODE: Notes with mini shapes */}
      {isKids && !cell.isFixed && cell.userAnswer === null && cell.notes.length > 0 && (
        <div className="grid grid-cols-3 gap-0 w-full h-full p-0.5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <span key={n} className="flex items-center justify-center">
              {cell.notes.includes(n) ? (
                <NumberShape value={n} size={8} showNumber={false} />
              ) : null}
            </span>
          ))}
        </div>
      )}

      {/* CHEMISTRY MODE: Fixed cell with element symbol */}
      {isChemistry && cell.isFixed && cell.value !== null && (
        <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-700 dark:text-green-300 font-mono">
          {CHEMISTRY_ELEMENTS[cell.value]?.symbol}
        </span>
      )}
      
      {/* CHEMISTRY MODE: User answer with element symbol */}
      {isChemistry && !cell.isFixed && cell.userAnswer !== null && (
        <div className={cn(
          "relative",
          cell.isCorrect === false && "animate-shake"
        )}>
          <span className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono">
            {CHEMISTRY_ELEMENTS[cell.userAnswer]?.symbol}
          </span>
          {cell.isCorrect === false && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-[7px] text-white font-bold">✕</span>
            </div>
          )}
        </div>
      )}

      {/* CHEMISTRY MODE: Notes with mini element symbols */}
      {isChemistry && !cell.isFixed && cell.userAnswer === null && cell.notes.length > 0 && (
        <div className="grid grid-cols-3 gap-0 w-full h-full p-0.5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <span key={n} className="flex items-center justify-center">
              {cell.notes.includes(n) ? (
                <span className="text-xs sm:text-sm md:text-base font-mono text-green-600 dark:text-green-400">
                  {CHEMISTRY_ELEMENTS[n]?.symbol}
                </span>
              ) : null}
            </span>
          ))}
        </div>
      )}
      
      {/* MATH MODE: Fixed cell with expression */}
      {!isKids && cell.isFixed && cell.expression && (
        <span className="leading-tight text-center px-0.5 text-[8px] sm:text-[9px] md:text-[10px] font-medium break-all whitespace-normal line-clamp-2">
          {cell.expression.display}
        </span>
      )}
      
      {/* MATH MODE: User answer */}
      {!isKids && !isChemistry && !cell.isFixed && cell.userAnswer !== null && (
        <span className="text-sm sm:text-base md:text-lg font-bold">
          {cell.userAnswer}
        </span>
      )}
      
      {/* MATH MODE: Notes */}
      {!isKids && !isChemistry && !cell.isFixed && cell.userAnswer === null && cell.notes.length > 0 && (
        <div className="grid grid-cols-3 gap-0 w-full h-full p-0.5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <span
              key={n}
              className={cn(
                "text-[6px] sm:text-[7px] flex items-center justify-center",
                cell.notes.includes(n) ? "text-indigo-600 dark:text-indigo-400" : "text-transparent"
              )}
            >
              {n}
            </span>
          ))}
        </div>
      )}
      
      {/* Error animation overlay */}
      {!cell.isFixed && cell.isCorrect === false && (
        <div className="absolute inset-0 bg-red-500/20 animate-pulse rounded" />
      )}
      
      {/* Success animation overlay */}
      {!cell.isFixed && cell.isCorrect === true && (
        <div className={cn(
          "absolute inset-0 animate-[ping_0.5s_ease-out_1] rounded pointer-events-none",
          isKids ? "bg-green-500/10" : "bg-blue-500/10"
        )} />
      )}
    </button>
  );
}

export function GameBoard() {
  const { gameState, gameMode } = useGame();
  
  if (!gameState) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={cn(
          "animate-spin w-8 h-8 border-4 border-t-transparent rounded-full",
          gameMode === 'kids' ? "border-pink-500" : gameMode === 'chemistry' ? "border-green-500" : "border-indigo-500"
        )} />
      </div>
    );
  }

  const isKids = gameMode === 'kids';
  const isChemistry = gameMode === 'chemistry';

  return (
    <div className="w-full max-w-[360px] sm:max-w-[420px] md:max-w-[480px] mx-auto">
      <div className={cn(
        "grid grid-cols-9 p-0.5 rounded-xl shadow-xl border-2 min-h-[360px] sm:min-h-[420px] md:min-h-[480px]",
        isKids 
          ? "bg-pink-300 dark:bg-pink-700 border-pink-400 dark:border-pink-600"
          : isChemistry
          ? "bg-green-300 dark:bg-green-700 border-green-400 dark:border-green-600"
          : "bg-indigo-400 dark:bg-indigo-700 border-indigo-500 dark:border-indigo-600"
      )}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(row => (
          <React.Fragment key={row}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(col => (
              <GameCell key={`${row}-${col}`} row={row} col={col} />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
