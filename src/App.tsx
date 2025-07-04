import { useState, useCallback, useEffect } from 'react'
import './App.css'
import { CrosswordGrid } from './cw/grid'
import { Tab } from './cw/tabs/Tab'
import { Menu } from './cw/Menu'
import { useCrosswordState } from './hooks/useCrosswordState'
import { useCrosswordActions } from './hooks/useCrosswordActions'
import { useTheme } from './hooks/useTheme'
import { useClueManagement } from './hooks/useClueManagement'
import { assignClueNumbers, createInitialGrid, getWordAt, computeWordIndices } from './utils/gridUtils'
import { DEFAULT_SIZE, ACROSS, DOWN, CELL_SIZE, MENU_HEIGHT } from './constants/crossword'

function App() {
  // Use custom hooks for state management
  const {
    grid,
    setGrid,
    activeCell,
    setActiveCell,
    direction,
    setDirection,
    history,
    historyIndex,
    setHistory,
    setHistoryIndex,
    setIsUndoRedo,
  } = useCrosswordState();

  const { theme, handleThemeToggle } = useTheme();
  const [isSymmetrical, setIsSymmetrical] = useState<boolean>(true);

  // Use custom hooks for actions
  const {
    handleUndo,
    handleRedo,
    handleErase,
    handleNewPuzzle,
  } = useCrosswordActions(
    grid,
    setGrid,
    setActiveCell,
    setDirection,
    history,
    historyIndex,
    setHistory,
    setHistoryIndex,
    setIsUndoRedo
  );

  const { handleClueUpdate } = useClueManagement(setGrid);

  // Computed values
  const gridHeight = grid.length * CELL_SIZE;

  // Helper to get word at a cell (memoized)
  const getWordAtCallback = useCallback((row: number, col: number, dir: 'across' | 'down') => {
    return getWordAt(grid, row, col, dir);
  }, [grid]);

  // Initialize grid on mount
  useEffect(() => {
    if (!grid.length) {
      const initialGrid = createInitialGrid(DEFAULT_SIZE);
      const gridWithNumbers = assignClueNumbers(initialGrid, DEFAULT_SIZE);
      setGrid(gridWithNumbers);
      // Initialize history with the first state
      setHistory([gridWithNumbers]);
      setHistoryIndex(0);
      setActiveCell([0, 0]);
    }
  }, []); // <-- only run once

  // Update clue numbers when the number of black squares changes
  useEffect(() => {
    if (!grid.length) return;
    setGrid(prev => assignClueNumbers(prev, prev.length));
  }, [grid.flat().filter(cell => cell.state === 'black').length]);

  // Symmetry toggle handler
  const handleSymmetryToggle = useCallback(() => {
    setIsSymmetrical(prev => !prev);
  }, []);

  return (
    <div className="app-container">
      <Menu 
        height={MENU_HEIGHT} 
        onThemeToggle={handleThemeToggle} 
        onErase={handleErase} 
        onNewPuzzle={handleNewPuzzle} 
        onSymmetryToggle={handleSymmetryToggle} 
        onUndo={handleUndo} 
        onRedo={handleRedo} 
        isSymmetrical={isSymmetrical} 
        canUndo={historyIndex > 0} 
        canRedo={historyIndex < history.length - 1} 
      />
      <div className="app-content">
        <div className="grid-section">
          <CrosswordGrid
            grid={grid}
            setGrid={setGrid}
            activeCell={activeCell}
            setActiveCell={setActiveCell}
            direction={direction}
            setDirection={setDirection}
            wordIndices={{
              across: computeWordIndices(grid, activeCell[0], activeCell[1], ACROSS),
              down: computeWordIndices(grid, activeCell[0], activeCell[1], DOWN)
            }}
            getWordAt={getWordAtCallback}
            size={DEFAULT_SIZE}
            isSymmetrical={isSymmetrical}
          />
        </div>
        {grid.length > 0 && (
          <div className="sidebar-section">
            <Tab
              cell={grid[activeCell[0]][activeCell[1]]}
              grid={grid}
              position={activeCell}
              direction={direction}
              wordIndices={{
                across: computeWordIndices(grid, activeCell[0], activeCell[1], ACROSS),
                down: computeWordIndices(grid, activeCell[0], activeCell[1], DOWN)
              }}
              acrossWord={getWordAtCallback(activeCell[0], activeCell[1], ACROSS)}
              downWord={getWordAtCallback(activeCell[0], activeCell[1], DOWN)}
              onClueUpdate={handleClueUpdate}
              gridHeight={gridHeight}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default App
