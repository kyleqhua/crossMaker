import { useCallback } from 'react';
import type { Cell } from './useCrosswordState';
import { assignClueNumbers, createInitialGrid } from '../utils/gridUtils';
import { ACROSS, DEFAULT_SIZE } from '../constants/crossword';

export function useCrosswordActions(
  grid: Cell[][],
  setGrid: React.Dispatch<React.SetStateAction<Cell[][]>>,
  setActiveCell: (cell: [number, number]) => void,
  setDirection: (direction: 'across' | 'down') => void,
  history: Cell[][][],
  historyIndex: number,
  setHistory: React.Dispatch<React.SetStateAction<Cell[][][]>>,
  setHistoryIndex: (index: number) => void,
  setIsUndoRedo: (flag: boolean) => void
) {
  // Undo handler
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setIsUndoRedo(true);
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setGrid(history[newIndex]);
    }
  }, [history, historyIndex, setGrid, setHistoryIndex, setIsUndoRedo]);

  // Redo handler
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setIsUndoRedo(true);
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setGrid(history[newIndex]);
    }
  }, [history, historyIndex, setGrid, setHistoryIndex, setIsUndoRedo]);

  // Erase function to clear the board
  const handleErase = useCallback(() => {
    const size = grid.length || DEFAULT_SIZE;
    const initialGrid = createInitialGrid(size);
    const gridWithNumbers = assignClueNumbers(initialGrid, size);
    setGrid(gridWithNumbers);
    setActiveCell([0, 0]);
    setDirection(ACROSS);
  }, [grid.length, setGrid, setActiveCell, setDirection]);

  // New Puzzle handler
  const handleNewPuzzle = useCallback((size: number) => {
    const initialGrid = createInitialGrid(size);
    const gridWithNumbers = assignClueNumbers(initialGrid, size);
    setGrid(gridWithNumbers);
    // Reset history
    setHistory([gridWithNumbers]);
    setHistoryIndex(0);
    setActiveCell([0, 0]);
    setDirection(ACROSS);
  }, [setGrid, setHistory, setHistoryIndex, setActiveCell, setDirection]);

  return {
    handleUndo,
    handleRedo,
    handleErase,
    handleNewPuzzle,
  };
} 