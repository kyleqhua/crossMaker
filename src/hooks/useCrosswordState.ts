import { useState, useEffect } from 'react';
import { DEFAULT_SIZE, ACROSS } from '../constants/crossword';

export interface Cell {
  letter: string;
  state: 'empty' | 'filled' | 'active' | 'black';
  label?: number;
  clue?: {
    across?: string;
    down?: string;
  };
}

export interface CrosswordState {
  grid: Cell[][];
  activeCell: [number, number];
  direction: 'across' | 'down';
}

// Helper to load state from localStorage
function loadCrosswordState(): Partial<CrosswordState> {
  const saved = localStorage.getItem('crosswordState');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {}
  }
  return {};
}

// Helper to load history from localStorage
function loadCrosswordHistory() {
  const saved = localStorage.getItem('crosswordHistory');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {}
  }
  return { history: [], historyIndex: 0 };
}

export function useCrosswordState() {
  const savedState = loadCrosswordState();
  const savedHistory = loadCrosswordHistory();

  const [grid, setGrid] = useState<Cell[][]>(savedState.grid || []);
  const [activeCell, setActiveCell] = useState<[number, number]>(savedState.activeCell || [0, 0]);
  const [direction, setDirection] = useState<'across' | 'down'>(savedState.direction || ACROSS);
  const [history, setHistory] = useState<Cell[][][]>(savedHistory.history || []);
  const [historyIndex, setHistoryIndex] = useState<number>(savedHistory.historyIndex || 0);
  const [isUndoRedo, setIsUndoRedo] = useState<boolean>(false);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(
      'crosswordState',
      JSON.stringify({ grid, activeCell, direction })
    );
  }, [grid, activeCell, direction]);

  // Save grid changes to history (but not for clue number updates)
  useEffect(() => {
    if (grid.length > 0 && history.length > 0 && !isUndoRedo) {
      const currentGridString = JSON.stringify(grid);
      const lastHistoryString = JSON.stringify(history[historyIndex]);
      
      // Only save if the grid actually changed (not just clue numbers)
      if (currentGridString !== lastHistoryString) {
        const gridCopy = grid.map(row => row.map(cell => ({ ...cell })));
        setHistory(prev => {
          const newHistory = prev.slice(0, historyIndex + 1);
          newHistory.push(gridCopy);
          // Limit history to 50 states
          if (newHistory.length > 50) {
            newHistory.shift();
          }
          return newHistory;
        });
        setHistoryIndex(prev => prev + 1);
      }
    }
    // Reset the flag after the effect runs
    if (isUndoRedo) {
      setIsUndoRedo(false);
    }
  }, [grid, historyIndex, isUndoRedo]);

  // Persist history and historyIndex
  useEffect(() => {
    localStorage.setItem(
      'crosswordHistory',
      JSON.stringify({ history, historyIndex })
    );
  }, [history, historyIndex]);

  return {
    grid,
    setGrid,
    activeCell,
    setActiveCell,
    direction,
    setDirection,
    history,
    setHistory,
    historyIndex,
    setHistoryIndex,
    isUndoRedo,
    setIsUndoRedo,
  };
} 