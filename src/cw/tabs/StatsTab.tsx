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

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const MAX_WORD_LENGTH = 15;

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

  // Letter distribution (A-Z)
  const getLetterDistribution = () => {
    const counts: Record<string, number> = {};
    LETTERS.forEach(l => (counts[l] = 0));
    for (let row of grid) {
      for (let cell of row) {
        if (cell.letter && cell.letter.match(/^[A-Z]$/i)) {
          const upper = cell.letter.toUpperCase();
          if (counts[upper] !== undefined) counts[upper]++;
        }
      }
    }
    return counts;
  };

  // Word length distribution (across and down)
  const getWordLengthDistribution = () => {
    const lengths: Record<number, number> = {};
    for (let i = 1; i <= MAX_WORD_LENGTH; i++) lengths[i] = 0;
    // Across
    for (let row of grid) {
      let len = 0;
      for (let cell of row) {
        if (cell.state !== 'black') {
          len++;
        } else {
          if (len > 0 && len <= MAX_WORD_LENGTH) lengths[len]++;
          len = 0;
        }
      }
      if (len > 0 && len <= MAX_WORD_LENGTH) lengths[len]++;
    }
    // Down
    for (let col = 0; col < grid[0]?.length; col++) {
      let len = 0;
      for (let row = 0; row < grid.length; row++) {
        const cell = grid[row][col];
        if (cell.state !== 'black') {
          len++;
        } else {
          if (len > 0 && len <= MAX_WORD_LENGTH) lengths[len]++;
          len = 0;
        }
      }
      if (len > 0 && len <= MAX_WORD_LENGTH) lengths[len]++;
    }
    return lengths;
  };

  const stats = calculateStats();
  const letterDist = getLetterDistribution();
  const wordLenDist = getWordLengthDistribution();

  return (
    <div className="stats-content">
      <h3>Grid Statistics</h3>
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
      </div>
      <div className="stats-tables-row">
        <div className="stats-table">
          <div className="stats-table-title">Letters</div>
          <div className="stats-table-list">
            {LETTERS.map(l => (
              <div className="stats-table-row" key={l}>
                <span className="stats-table-label">{l}</span>
                <span className="stats-table-value">{letterDist[l]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="stats-table">
          <div className="stats-table-title">Word lengths</div>
          <div className="stats-table-list">
            {Array.from({ length: MAX_WORD_LENGTH }, (_, i) => i + 1).map(len => (
              <div className="stats-table-row" key={len}>
                <span className="stats-table-label">{len}</span>
                <span className="stats-table-value">{wordLenDist[len]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 