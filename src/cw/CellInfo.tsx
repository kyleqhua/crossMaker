import React, { useState, useEffect } from 'react';
import './tabs/UnifiedInfo.css';

interface Cell {
  letter: string;
  state: 'empty' | 'filled' | 'active' | 'black';
  label?: number;
  clue?: {
    across?: string;
    down?: string;
  };
}

interface CellInfoProps {
  cell: Cell;
  grid: Cell[][];
  position: [number, number];
  direction: 'across' | 'down';
  wordIndices: {
    across: { start: number; end: number };
    down: { start: number; end: number };
  };
  acrossWord: string;
  downWord: string;
  onClueUpdate?: (row: number, col: number, dir: 'across' | 'down', clue: string) => void;
}

export const CellInfo: React.FC<CellInfoProps> = ({
  cell,
  grid,
  position,
  direction,
  wordIndices,
  acrossWord,
  downWord,
  onClueUpdate
}) => {
  const [acrossClue, setAcrossClue] = useState(cell.clue?.across || '');
  const [downClue, setDownClue] = useState(cell.clue?.down || '');

  // Update clue state when cell changes
  useEffect(() => {
    setAcrossClue(cell.clue?.across || '');
    setDownClue(cell.clue?.down || '');
  }, [cell.clue]);

  const handleClueChange = (dir: 'across' | 'down', value: string) => {
    if (dir === 'across') {
      setAcrossClue(value);
      onClueUpdate?.(position[0], position[1], 'across', value);
    } else {
      setDownClue(value);
      onClueUpdate?.(position[0], position[1], 'down', value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Stop propagation of keyboard events when editing clues
    e.stopPropagation();
  };

  // Get the label for the across word
  const getAcrossLabel = () => {
    if (wordIndices.across.start < 0 || wordIndices.across.start >= grid[0].length) {
      return '';
    }
    const acrossCell = grid[position[0]][wordIndices.across.start];
    return acrossCell?.label ? `${acrossCell.label}a.` : '';
  };

  // Get the label for the down word
  const getDownLabel = () => {
    if (wordIndices.down.start < 0 || wordIndices.down.start >= grid.length) {
      return '';
    }
    const downCell = grid[wordIndices.down.start][position[1]];
    return downCell?.label ? `${downCell.label}d.` : '';
  };

  return (
    <div className="cell-info">
      <h3>Info</h3>
      <div className="cell-position">
        Row: {position[0] + 1}, Col: {position[1] + 1}
      </div>
      <div className="cell-direction">
        Direction: {direction.charAt(0).toUpperCase() + direction.slice(1)}
      </div>
      {cell.label && (
        <div className="cell-label">
          Number: {cell.label}
        </div>
      )}
      <div className="word-info">
        <div className="across-word">
          <label>{getAcrossLabel()}</label>
          <input
            type="text"
            value={acrossWord}
            readOnly
          />
          <div className="clue-section">
            <textarea
              value={acrossClue}
              onChange={(e) => handleClueChange('across', e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter across clue..."
              rows={3}
            />
          </div>
        </div>
        <div className="down-word">
          <label>{getDownLabel()}</label>
          <input
            type="text"
            value={downWord}
            readOnly
          />
          <div className="clue-section">
            <textarea
              value={downClue}
              onChange={(e) => handleClueChange('down', e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter down clue..."
              rows={3}
            />
          </div>
        </div>
      </div>
    </div>
  );
}; 