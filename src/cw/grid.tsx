//const DEFAULT_SIZE = 15;
// class CrosswordGrid {
//     constructor(rows = DEFAULT_SIZE, cols = DEFAULT_SIZE) {
//       this.clues = {};
//       this.title = DEFAULT_TITLE;
//       this.author = DEFAULT_AUTHOR;
//       this.rows = rows;
//       this.cols = cols;
//       this.fill = [];
//       //
//       for (let i = 0; i < this.rows; i++) {
//         this.fill.push("");
//         for (let j = 0; j < this.cols; j++) {
//           this.fill[i] += BLANK;
//         }
//       }
//     }
//   }

import React, { useState, useEffect, useCallback } from 'react';
import './grid.css';
import { CellInfo } from './CellInfo';

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

const DASH = "-";
const BLANK = " ";
const ACROSS = "across";
const DOWN = "down";
const DEFAULT_SIZE = 15;


interface Cell {
  letter: string;
  state: 'empty' | 'filled' | 'active' | 'black';
  label?: number;
}

interface WordIndices {
  start: number;
  end: number;
}

interface CrosswordGridProps {
  size?: number;
  onGridChange?: (grid: Cell[][]) => void;
  isSymmetrical?: boolean;
}

export const CrosswordGrid: React.FC<CrosswordGridProps> = ({ 
  size = DEFAULT_SIZE, 
  onGridChange,
  isSymmetrical = true 
}) => {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [activeCell, setActiveCell] = useState<[number, number]>([0, 0]);
  const [direction, setDirection] = useState<'across' | 'down'>(ACROSS);
  const [wordIndices, setWordIndices] = useState<{
    across: WordIndices;
    down: WordIndices;
  }>({
    across: { start: 0, end: size },
    down: { start: 0, end: size }
  });

  // Initialize grid
  useEffect(() => {
    const initialGrid = Array(size).fill(null).map(() =>
      Array(size).fill(null).map(() => ({
        letter: BLANK,
        state: 'empty' as const
      }))
    );
    setGrid(initialGrid);
    setActiveCell([0, 0]); // Always set active cell to first square after grid initializes
  }, [size]);

  // Notify parent of grid changes
  useEffect(() => {
    onGridChange?.(grid);
  }, [grid, onGridChange]);

  const handleCellClick = (row: number, col: number) => {
    setActiveCell([row, col]);
    // Toggle direction if clicking the same cell
    if (row === activeCell[0] && col === activeCell[1]) {
      setDirection(prev => prev === ACROSS ? DOWN : ACROSS);
    }
    getWordAt(row, col, direction, true);
  };

  const getWordAt = useCallback((row: number, col: number, dir: 'across' | 'down', setIndices: boolean = false) => {
    let text = "";
    let start = 0;
    let end = size;

    if (dir === ACROSS) {
      text = grid[row].map(cell => cell.letter).join('');
      // Find word boundaries
      for (let i = col; i >= 0; i--) {
        if (grid[row][i].state === 'black') {
          start = i + 1;
          break;
        }
      }
      for (let i = col; i < size; i++) {
        if (grid[row][i].state === 'black') {
          end = i;
          break;
        }
      }
    } else {
      text = grid.map(row => row[col].letter).join('');
      // Find word boundaries
      for (let i = row; i >= 0; i--) {
        if (grid[i][col].state === 'black') {
          start = i + 1;
          break;
        }
      }
      for (let i = row; i < size; i++) {
        if (grid[i][col].state === 'black') {
          end = i;
          break;
        }
      }
    }

    if (setIndices) {
      setWordIndices(prev => ({
        ...prev,
        [dir]: { start, end }
      }));
    }

    return text.slice(start, end).replace(new RegExp(BLANK, 'g'), DASH);
  }, [grid, size]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.repeat) return;

    const [row, col] = activeCell;
    let newRow = row;
    let newCol = col;

    console.log('Key pressed:', e.key, 'Key code:', e.which);

    switch (e.which) {
      case keyboard.black:
        e.preventDefault();
        setGrid(prev => {
          console.log('Black square toggle detected');

          const newGrid = [...prev];
          const currentState = newGrid[row][col].state;
          console.log('Current state before change:', currentState);
          
          if (currentState === 'black') {
            newGrid[row][col] = { letter: BLANK, state: 'empty' };
          } else {
            newGrid[row][col] = { letter: BLANK, state: 'black' };
          }
          
          if (isSymmetrical) {
            const symRow = size - 1 - row;
            const symCol = size - 1 - col;
            newGrid[symRow][symCol] = { ...newGrid[row][col] };
          }
          
          console.log('New state after change:', newGrid[row][col].state);
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
            console.log('deleting cell');
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

    // Log grid state after key handling
    console.log('Grid State:', {
      currentCell: {
        position: [newRow, newCol],
        state: grid[newRow][newCol].state,
        letter: grid[newRow][newCol].letter,
        direction: direction
      },
      wordIndices: {
        across: wordIndices.across,
        down: wordIndices.down
      },
      currentWord: {
        across: getWordAt(newRow, newCol, ACROSS),
        down: getWordAt(newRow, newCol, DOWN)
      }
    });
  }, [activeCell, direction, size, isSymmetrical, getWordAt, grid, wordIndices]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
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
                  className={`grid-cell ${
                    cell.state === 'black' ? 'black' :
                    isActive ? 'active' :
                    isHighlighted ? 'highlight' :
                    isLowlighted ? 'lowlight' :
                    cell.state
                  }`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cell.label && <div className="label">{cell.label}</div>}
                  {cell.letter}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {/* <CellInfo
        cell={grid[activeCell[0]][activeCell[1]]}
        position={activeCell}
        direction={direction}
        wordIndices={wordIndices}
        acrossWord={getWordAt(activeCell[0], activeCell[1], ACROSS)}
        downWord={getWordAt(activeCell[0], activeCell[1], DOWN)}
      /> */}
    </div>
  );
}; 