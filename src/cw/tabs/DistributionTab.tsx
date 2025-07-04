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

// Histogram bar component
interface HistogramBarProps {
  label: string;
  value: number;
  maxValue: number;
  color?: string;
}

const HistogramBar: React.FC<HistogramBarProps> = ({ label, value, maxValue, color = 'var(--color-primary)' }) => {
  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
  
  return (
    <div className="histogram-row">
      <div className="histogram-label">{label}</div>
      <div className="histogram-bar-container">
        <div 
          className="histogram-bar" 
          style={{ 
            width: `${percentage}%`,
            backgroundColor: color
          }}
        >
          {value > 0 && (
            <span className="histogram-value">{value}</span>
          )}
        </div>
      </div>
    </div>
  );
};

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

  // Calculate max values for scaling
  const maxLetterCount = Math.max(...Object.values(letterDist));
  const maxWordLengthCount = Math.max(...Object.values(wordLenDist));

  return (
    <div className="distribution-content">
      <div className="stats-tables-row">
        <div className="stats-table">
          <div className="stats-table-title">Letter Distribution</div>
          <div className="histogram-container">
            {LETTERS.map(l => (
              <HistogramBar
                key={l}
                label={l}
                value={letterDist[l]}
                maxValue={maxLetterCount}
                color="var(--color-primary)"
              />
            ))}
          </div>
        </div>
        <div className="stats-table">
          <div className="stats-table-title">Word Length Distribution</div>
          <div className="histogram-container">
            {Array.from({ length: MAX_WORD_LENGTH }, (_, i) => i + 1).map(len => (
              <HistogramBar
                key={len}
                label={len.toString()}
                value={wordLenDist[len]}
                maxValue={maxWordLengthCount}
                color="var(--color-accent)"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 