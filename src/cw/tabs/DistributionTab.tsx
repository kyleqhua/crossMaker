import React from 'react';
import './Stats.css';

interface Cell {
  letter: string;
  state: 'empty' | 'filled' | 'active' | 'black';
  label?: number;
  clue?: {
    across?: string;
    down?: string;
  };
}

interface DistributionTabProps {
  grid: Cell[][];
}

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const MAX_WORD_LENGTH = 15;

export const DistributionTab: React.FC<DistributionTabProps> = ({ grid }) => {
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

  const letterDist = getLetterDistribution();
  const wordLenDist = getWordLengthDistribution();

  return (
    <div className="distribution-content">
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