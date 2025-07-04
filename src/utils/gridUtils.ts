import type { Cell } from '../hooks/useCrosswordState';
import { BLANK, DASH, ACROSS, DOWN } from '../constants/crossword';

// Helper to assign clue numbers
export function assignClueNumbers(grid: Cell[][], size: number): Cell[][] {
  let count = 1;
  const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      let isAcross = false;
      let isDown = false;
      if (newGrid[i][j].state !== 'black') {
        isDown = i === 0 || newGrid[i - 1][j].state === 'black';
        isAcross = j === 0 || newGrid[i][j - 1].state === 'black';
      }
      if (isAcross || isDown) {
        newGrid[i][j].label = count;
        count++;
      } else {
        newGrid[i][j].label = undefined;
      }
    }
  }
  return newGrid;
}

// Compute word indices utility
export function computeWordIndices(grid: Cell[][], row: number, col: number, dir: 'across' | 'down') {
  let start, end;
  const size = grid.length;
  if (dir === 'across') {
    start = col;
    while (start > 0 && grid[row][start - 1].state !== 'black') {
      start--;
    }
    end = col;
    while (end < size - 1 && grid[row][end + 1].state !== 'black') {
      end++;
    }
    end += 1; // exclusive
  } else {
    start = row;
    while (start > 0 && grid[start - 1][col].state !== 'black') {
      start--;
    }
    end = row;
    while (end < size - 1 && grid[end + 1][col].state !== 'black') {
      end++;
    }
    end += 1; // exclusive
  }
  return { start, end };
}

// Helper to get word at a cell
export function getWordAt(grid: Cell[][], row: number, col: number, dir: 'across' | 'down'): string {
  let text = "";
  let start = 0;
  let end = grid.length;
  if (!grid.length) return '';
  
  if (dir === ACROSS) {
    text = grid[row].map((cell: Cell) => cell.letter).join('');
    for (let i = col; i >= 0; i--) {
      if (grid[row][i].state === 'black') {
        start = i + 1;
        break;
      }
    }
    for (let i = col; i < grid.length; i++) {
      if (grid[row][i].state === 'black') {
        end = i;
        break;
      }
    }
  } else {
    text = grid.map((row: Cell[]) => row[col].letter).join('');
    for (let i = row; i >= 0; i--) {
      if (grid[i][col].state === 'black') {
        start = i + 1;
        break;
      }
    }
    for (let i = row; i < grid.length; i++) {
      if (grid[i][col].state === 'black') {
        end = i;
        break;
      }
    }
  }
  return text.slice(start, end).replace(new RegExp(BLANK, 'g'), DASH);
}

// Create initial grid
export function createInitialGrid(size: number): Cell[][] {
  return Array(size).fill(null).map(() =>
    Array(size).fill(null).map(() => ({
      letter: BLANK,
      state: 'empty'
    }))
  );
} 