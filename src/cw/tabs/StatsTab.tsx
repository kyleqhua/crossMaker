import React from 'react';
import './UnifiedInfo.css';

interface Cell {
  letter: string;
  state: 'empty' | 'filled' | 'active' | 'black';
  label?: number;
  clue?: {
    across?: string;
    down?: string;
  };
}

interface StatsTabProps {
  grid: Cell[][];
}

export const StatsTab: React.FC<StatsTabProps> = ({ grid }) => {
  const calculateStats = () => {
    let totalCells = 0;
    let filledCells = 0;
    let blackCells = 0;
    let emptyCells = 0;
    let words = 0;

    // Count cells and find words
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        totalCells++;
        const cellState = grid[i][j].state;
        
        switch (cellState) {
          case 'filled':
            filledCells++;
            break;
          case 'black':
            blackCells++;
            break;
          case 'empty':
            emptyCells++;
            break;
        }

        // Count words (cells with labels)
        if (grid[i][j].label) {
          words++;
        }
      }
    }

    return {
      totalCells,
      filledCells,
      blackCells,
      emptyCells,
      words,
      fillPercentage: totalCells > 0 ? Math.round((filledCells / totalCells) * 100) : 0
    };
  };

  // Calculate mean word length (across and down)
  const getMeanWordLength = () => {
    let wordLengths: number[] = [];
    // Across
    for (let row of grid) {
      let len = 0;
      for (let cell of row) {
        if (cell.state !== 'black') {
          len++;
        } else {
          if (len > 0) wordLengths.push(len);
          len = 0;
        }
      }
      if (len > 0) wordLengths.push(len);
    }
    // Down
    for (let col = 0; col < grid[0]?.length; col++) {
      let len = 0;
      for (let row = 0; row < grid.length; row++) {
        const cell = grid[row][col];
        if (cell.state !== 'black') {
          len++;
        } else {
          if (len > 0) wordLengths.push(len);
          len = 0;
        }
      }
      if (len > 0) wordLengths.push(len);
    }
    if (wordLengths.length === 0) return 0;
    const sum = wordLengths.reduce((a, b) => a + b, 0);
    return sum / wordLengths.length;
  };

  const stats = calculateStats();
  const meanWordLength = getMeanWordLength();

  return (
    <div className="stats-content">
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-label">Total Cells:</span>
          <span className="stat-value">{stats.totalCells}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Filled Cells:</span>
          <span className="stat-value">{stats.filledCells}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Empty Cells:</span>
          <span className="stat-value">{stats.emptyCells}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Black Cells:</span>
          <span className="stat-value">{stats.blackCells}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Words:</span>
          <span className="stat-value">{stats.words}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Fill %:</span>
          <span className="stat-value">{stats.fillPercentage}%</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Mean word length:</span>
          <span className="stat-value">{meanWordLength.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}; 