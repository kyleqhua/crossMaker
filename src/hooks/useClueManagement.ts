import { useCallback } from 'react';
import type { Cell } from './useCrosswordState';
import { computeWordIndices } from '../utils/gridUtils';
import { ACROSS } from '../constants/crossword';

export function useClueManagement(
  setGrid: React.Dispatch<React.SetStateAction<Cell[][]>>
) {
  // Update handleClueUpdate to use computeWordIndices
  const handleClueUpdate = useCallback((row: number, col: number, dir: 'across' | 'down', clue: string) => {
    setGrid((prev: Cell[][]) => {
      const newGrid = [...prev];
      const indices = computeWordIndices(newGrid, row, col, dir);
      const start = indices.start;
      const end = indices.end;
      if (dir === ACROSS) {
        for (let i = start; i < end; i++) {
          newGrid[row][i] = {
            ...newGrid[row][i],
            clue: {
              ...newGrid[row][i].clue,
              across: clue
            }
          };
        }
      } else {
        for (let i = start; i < end; i++) {
          newGrid[i][col] = {
            ...newGrid[i][col],
            clue: {
              ...newGrid[i][col].clue,
              down: clue
            }
          };
        }
      }
      return newGrid;
    });
  }, [setGrid]);

  return {
    handleClueUpdate,
  };
} 