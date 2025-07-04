import React, { useState, useEffect } from 'react';
import { FiHash, FiType, FiEdit3 } from 'react-icons/fi';
import './Info.css';

interface Cell {
  letter: string;
  state: 'empty' | 'filled' | 'active' | 'black';
  label?: number;
  clue?: {
    across?: string;
    down?: string;
  };
}

interface InfoProps {
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

export const Info: React.FC<InfoProps> = ({
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

  // Calculate word lengths
  const acrossWordLength = acrossWord.replace(/\s/g, '').length;
  const downWordLength = downWord.replace(/\s/g, '').length;

  // Format word for display with underscores for empty spaces
  const formatWordDisplay = (word: string) => {
    if (!word) return '_ '.repeat(5); // Default placeholder
    return word.split('').map(char => char === ' ' ? '_' : char).join(' ');
  };

  return (
    <div className="cell-info">
      {cell.state === 'black' ? (
        <div className="black-cell-message">
          <span role="img" aria-label="black square">⬛</span>
          <div>This is a black cell.<br/>No clue or word here.</div>
        </div>
      ) : (
        <>
          {/* Across Clue Section */}
          {getAcrossLabel() && (
            <div className="clue-section-main">
              <div className="clue-header-main">
                <div className="clue-number-main">
                  <FiHash className="clue-icon" />
                  {getAcrossLabel()}
                  {acrossWordLength > 0 && (
                    <span className="word-length-hint">({acrossWordLength} letters)</span>
                  )}
                </div>
              </div>
              
              <div className="word-preview-main">
                <FiType className="word-icon" />
                <span className="word-display">{formatWordDisplay(acrossWord)}</span>
              </div>
              
              <div className="clue-input-section">
                <div className="clue-input-label">
                  <FiEdit3 className="edit-icon" />
                  Clue:
                </div>
                <textarea
                  className="clue-input-main"
                  value={acrossClue}
                  onChange={(e) => handleClueChange('across', e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter across clue..."
                  rows={3}
                />
                {/* {acrossClue && (
                  <div className="clue-status">
                    <span className="status-indicator">✅ Clue saved</span>
                  </div>
                )} */}
              </div>
            </div>
          )}

          {/* Down Clue Section */}
          {getDownLabel() && (
            <div className="clue-section-main">
              <div className="clue-header-main">
                <div className="clue-number-main">
                  <FiHash className="clue-icon" />
                  {getDownLabel()}
                  {downWordLength > 0 && (
                    <span className="word-length-hint">({downWordLength} letters)</span>
                  )}
                </div>
              </div>
              
              <div className="word-preview-main">
                <FiType className="word-icon" />
                <span className="word-display">{formatWordDisplay(downWord)}</span>
              </div>
              
              <div className="clue-input-section">
                <div className="clue-input-label">
                  <FiEdit3 className="edit-icon" />
                  Clue:
                </div>
                <textarea
                  className="clue-input-main"
                  value={downClue}
                  onChange={(e) => handleClueChange('down', e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter down clue..."
                  rows={3}
                />
                {/* {downClue && (
                  <div className="clue-status">
                    <span className="status-indicator">✅ Clue saved</span>
                  </div>
                )} */}
              </div>
            </div>
          )}

          {/* Cell Info (minimal) */}
          <div className="cell-info-minimal">
            <span className="cell-position-minimal">
              Row {position[0] + 1}, Col {position[1] + 1}
            </span>
            {cell.label && (
              <span className="cell-number-minimal">
                • #{cell.label}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}; 