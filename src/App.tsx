import { useState, useCallback, useEffect } from 'react'

import './App.css'
import { CrosswordGrid } from './cw/grid'
import { CellInfo } from './cw/CellInfo'

const DEFAULT_SIZE = 15
const DASH = "-"
const BLANK = " "
const ACROSS = "across"
const DOWN = "down"

function App() {
  const [grid, setGrid] = useState<any[][]>([])
  const [activeCell, setActiveCell] = useState<[number, number]>([0, 0])
  const [direction, setDirection] = useState<'across' | 'down'>(ACROSS)
  const [wordIndices, setWordIndices] = useState({
    across: { start: 0, end: DEFAULT_SIZE },
    down: { start: 0, end: DEFAULT_SIZE }
  })

  // Helper to get word at a cell
  const getWordAt = useCallback((row: number, col: number, dir: 'across' | 'down', setIndices: boolean = false) => {
    let text = ""
    let start = 0
    let end = grid.length
    if (!grid.length) return ''
    if (dir === ACROSS) {
      text = grid[row].map((cell: any) => cell.letter).join('')
      for (let i = col; i >= 0; i--) {
        if (grid[row][i].state === 'black') {
          start = i + 1
          break
        }
      }
      for (let i = col; i < grid.length; i++) {
        if (grid[row][i].state === 'black') {
          end = i
          break
        }
      }
    } else {
      text = grid.map((row: any) => row[col].letter).join('')
      for (let i = row; i >= 0; i--) {
        if (grid[i][col].state === 'black') {
          start = i + 1
          break
        }
      }
      for (let i = row; i < grid.length; i++) {
        if (grid[i][col].state === 'black') {
          end = i
          break
        }
      }
    }
    if (setIndices) {
      setWordIndices((prev: any) => ({
        ...prev,
        [dir]: { start, end }
      }))
    }
    return text.slice(start, end).replace(new RegExp(BLANK, 'g'), DASH)
  }, [grid])

  // Update labels whenever grid changes
  const updateLabels = useCallback(() => {
    setGrid(prev => {
      const newGrid = [...prev];
      let count = 1;
      
      // First pass: identify cells that need labels
      for (let i = 0; i < DEFAULT_SIZE; i++) {
        for (let j = 0; j < DEFAULT_SIZE; j++) {
          let isAcross = false;
          let isDown = false;
          
          if (newGrid[i][j].state !== 'black') {
            isDown = i === 0 || newGrid[i - 1][j].state === 'black';
            isAcross = j === 0 || newGrid[i][j - 1].state === 'black';
          }
          
          if (isAcross || isDown) {
            newGrid[i][j] = { ...newGrid[i][j], label: count };
            count++;
          } else {
            newGrid[i][j] = { ...newGrid[i][j], label: undefined };
          }
        }
      }
      return newGrid;
    });
  }, []);

  // Handle clue updates
  const handleClueUpdate = useCallback((row: number, col: number, dir: 'across' | 'down', clue: string) => {
    setGrid(prev => {
      const newGrid = [...prev];
      const start = dir === ACROSS ? wordIndices.across.start : wordIndices.down.start;
      const end = dir === ACROSS ? wordIndices.across.end : wordIndices.down.end;

      // Update clue for all cells in the word
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
  }, [wordIndices]);

  // Ensure grid is initialized and update labels when grid changes
  useEffect(() => {
    if (!grid.length) {
      const initialGrid = Array(DEFAULT_SIZE).fill(null).map(() =>
        Array(DEFAULT_SIZE).fill(null).map(() => ({
          letter: BLANK,
          state: 'empty'
        }))
      )
      setGrid(initialGrid)
      setActiveCell([0, 0])
    } else {
      updateLabels();
    }
  }, [grid, updateLabels])

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <CrosswordGrid
        grid={grid}
        setGrid={setGrid}
        activeCell={activeCell}
        setActiveCell={setActiveCell}
        direction={direction}
        setDirection={setDirection}
        wordIndices={wordIndices}
        setWordIndices={setWordIndices}
        getWordAt={getWordAt}
        size={DEFAULT_SIZE}
      />
      {grid.length > 0 && (
        <CellInfo
          cell={grid[activeCell[0]][activeCell[1]]}
          grid={grid}
          position={activeCell}
          direction={direction}
          wordIndices={wordIndices}
          acrossWord={getWordAt(activeCell[0], activeCell[1], ACROSS)}
          downWord={getWordAt(activeCell[0], activeCell[1], DOWN)}
          onClueUpdate={handleClueUpdate}
        />
      )}
    </div>
  )
}

export default App
