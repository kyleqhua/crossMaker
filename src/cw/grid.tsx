import React, { useEffect, useCallback } from 'react';
import './grid.css';

const keyboard = {
  "a": 65, "b": 66, "c": 67, "d": 68, "e": 69, "f": 70, "g": 71, "h": 72,
  "i": 73, "j": 74, "k": 75, "l": 76, "m": 77, "n": 78, "o": 79, "p": 80,
  "q": 81, "r": 82, "s": 83, "t": 84, "u": 85, "v": 86, "w": 87, "x": 88, "y": 89,
  "z": 90,
  "black": 190, ".": 190,
  "delete": 8,
  "enter": 13,
  "space": 32,
  "left": 37,
  "up": 38,
  "right": 39,
  "down": 40
};

const BLANK = " ";
const ACROSS = "across";
const DOWN = "down";
const DEFAULT_SIZE = 15;

interface Cell {
  letter: string;
  state: 'empty' | 'filled' | 'active' | 'black';
  label?: number;
  clue?: {
    across?: string;
    down?: string;
  };
}

interface WordIndices {
  start: number;
  end: number;
}

interface CrosswordGridProps {
  grid: Cell[][];
  setGrid: React.Dispatch<React.SetStateAction<Cell[][]>>;
  activeCell: [number, number];
  setActiveCell: React.Dispatch<React.SetStateAction<[number, number]>>;
  direction: 'across' | 'down';
  setDirection: React.Dispatch<React.SetStateAction<'across' | 'down'>>;
  wordIndices: { across: WordIndices; down: WordIndices };
  setWordIndices: React.Dispatch<React.SetStateAction<{ across: WordIndices; down: WordIndices }>>;
  getWordAt: (row: number, col: number, dir: 'across' | 'down', setIndices?: boolean) => string;
  size?: number;
  onGridChange?: (grid: Cell[][]) => void;
  isSymmetrical?: boolean;
}

export const CrosswordGrid: React.FC<CrosswordGridProps> = ({
  grid,
  setGrid,
  activeCell,
  setActiveCell,
  direction,
  setDirection,
  wordIndices,
  getWordAt,
  size = DEFAULT_SIZE,
  onGridChange,
  isSymmetrical = true
}) => {
  // Initialize grid (handled in App)

  // Notify parent of grid changes
  useEffect(() => {
    onGridChange?.(grid);
  }, [grid, onGridChange]);

  const handleCellClick = (row: number, col: number) => {
    setActiveCell([row, col]);
    // Toggle direction if clicking the same cell
    if (row === activeCell[0] && col === activeCell[1]) {
      setDirection(prev => prev === ACROSS ? DOWN : ACROSS);
      // Add direction change animation class
      const cellElement = document.querySelector(`[data-cell="${row}-${col}"]`) as HTMLElement;
      if (cellElement) {
        cellElement.classList.add('direction-change');
        setTimeout(() => {
          cellElement.classList.remove('direction-change');
        }, 250);
      }
    }
    getWordAt(row, col, direction, true);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    //if (e.repeat) return;
    const [row, col] = activeCell;
    let newRow = row;
    let newCol = col;
    switch (e.which) {
      case keyboard.black:
        setGrid(prev => {
          const newGrid = [...prev];
          const currentState = newGrid[row][col].state;
          if (currentState === 'black') {
            newGrid[row][col] = { letter: BLANK, state: 'empty' };
          } else {
            newGrid[row][col] = { letter: BLANK, state: 'black' };
          }
          if (isSymmetrical) {
            const symRow = size - 1 - row;
            const symCol = size - 1 - col;
            // Only update symmetrical cell if it's within bounds
            if (symRow >= 0 && symRow < size && symCol >= 0 && symCol < size) {
              newGrid[symRow][symCol] = { ...newGrid[row][col] };
            }
          }
          return newGrid;
        });
        // Move to next cell after toggling black
        if (direction === ACROSS) {
          newCol = Math.min(size - 1, col + 1);
        } else {
          newRow = Math.min(size - 1, row + 1);
        }
        setActiveCell([newRow, newCol]);
        break;
      case keyboard.up:
        newRow = Math.max(0, row - 1);
        setDirection(DOWN);
        break;
      case keyboard.down:
        newRow = Math.min(size - 1, row + 1);
        setDirection(DOWN);
        break;
      case keyboard.left:
        newCol = Math.max(0, col - 1);
        setDirection(ACROSS);
        break;
      case keyboard.right:
        newCol = Math.min(size - 1, col + 1);
        setDirection(ACROSS);
        break;
      case keyboard.delete:
        setGrid(prev => {
          const newGrid = [...prev];
          newGrid[row][col] = { letter: BLANK, state: 'empty' };
          if (isSymmetrical) {
            const symRow = size - 1 - row;
            const symCol = size - 1 - col;
            if (newGrid[symRow][symCol].state === 'black') {
              newGrid[symRow][symCol] = { letter: BLANK, state: 'empty' };
            }
          }
          return newGrid;
        });
        // Move to previous cell
        if (direction === ACROSS) {
          newCol = Math.max(0, col - 1);
        } else {
          newRow = Math.max(0, row - 1);
        }
        break;
      case keyboard.enter:
        setDirection(prev => prev === ACROSS ? DOWN : ACROSS);
        // Add direction change animation class
        const cellElement = document.querySelector(`[data-cell="${row}-${col}"]`) as HTMLElement;
        if (cellElement) {
          cellElement.classList.add('direction-change');
          setTimeout(() => {
            cellElement.classList.remove('direction-change');
          }, 250);
        }
        break;
      default:
        if (e.which >= keyboard.a && e.which <= keyboard.z) {
          setGrid(prev => {
            const newGrid = [...prev];
            if (newGrid[row][col].state !== 'black') {
              newGrid[row][col] = {
                letter: String.fromCharCode(e.which).toUpperCase(),
                state: 'filled'
              };
            }
            return newGrid;
          });
          // Move to next cell
          if (direction === ACROSS) {
            newCol = Math.min(size - 1, col + 1);
          } else {
            newRow = Math.min(size - 1, row + 1);
          }
        }
    }
    setActiveCell([newRow, newCol]);
    getWordAt(newRow, newCol, direction, true);
  }, [activeCell, direction, size, isSymmetrical, setGrid, setActiveCell, setDirection, getWordAt]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="grid-container">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="grid-row">
          {row.map((cell, colIndex) => {
            const isActive = rowIndex === activeCell[0] && colIndex === activeCell[1];
            const isHighlighted =
              (direction === ACROSS && rowIndex === activeCell[0] &&
                colIndex >= wordIndices.across.start && colIndex < wordIndices.across.end) ||
              (direction === DOWN && colIndex === activeCell[1] &&
                rowIndex >= wordIndices.down.start && rowIndex < wordIndices.down.end);
            const isLowlighted =
              (direction === DOWN && rowIndex === activeCell[0] &&
                colIndex >= wordIndices.across.start && colIndex < wordIndices.across.end) ||
              (direction === ACROSS && colIndex === activeCell[1] &&
                rowIndex >= wordIndices.down.start && rowIndex < wordIndices.down.end);

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                data-cell={`${rowIndex}-${colIndex}`}
                className={`grid-cell ${
                  cell.state === 'black' ? 'black' :
                  isActive ? 'active' :
                  isHighlighted ? 'highlight' :
                  isLowlighted ? 'lowlight' :
                  cell.state
                }`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                role="button"
                tabIndex={0}
                aria-label={`Cell ${rowIndex + 1}, ${colIndex + 1}${cell.label ? `, number ${cell.label}` : ''}${cell.letter !== BLANK ? `, letter ${cell.letter}` : ''}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCellClick(rowIndex, colIndex);
                  }
                }}
              >
                {cell.label && <div className="label">{cell.label}</div>}
                {cell.letter}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}; 