import React, { useState, useEffect } from 'react';
import './CellInfo.css';

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
  const [editingAcross, setEditingAcross] = useState(false);
  const [editingDown, setEditingDown] = useState(false);

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
    const acrossCell = grid[position[0]][wordIndices.across.start];
    return acrossCell.label ? `${acrossCell.label}a.` : '';
  };

  // Get the label for the down word
  const getDownLabel = () => {
    const downCell = grid[wordIndices.down.start][position[1]];
    return downCell.label ? `${downCell.label}d.` : '';
  };

  return (
    <div className="cell-info">
      <h3>Info</h3>
      <div className="cell-position">
        Row: {position[0] + 1}, Col: {position[1] + 1}
      </div>
      <div className="cell-direction">
        Direction: {direction}
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
            <div className="clue-display" onClick={() => setEditingAcross(true)}>
              {acrossClue || '(No clue)'}
            </div>
            {editingAcross && (
              <input
                type="text"
                value={acrossClue}
                onChange={(e) => handleClueChange('across', e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => setEditingAcross(false)}
                autoFocus
                placeholder="Enter across clue..."
              />
            )}
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
            <div className="clue-display" onClick={() => setEditingDown(true)}>
              {downClue || '(No clue)'}
            </div>
            {editingDown && (
              <input
                type="text"
                value={downClue}
                onChange={(e) => handleClueChange('down', e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => setEditingDown(false)}
                autoFocus
                placeholder="Enter down clue..."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 