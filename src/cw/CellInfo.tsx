import React from 'react';
import './CellInfo.css';

interface Cell {
  letter: string;
  state: 'empty' | 'filled' | 'active' | 'black';
  label?: number;
}

interface CellInfoProps {
  cell: Cell;
  position: [number, number];
  direction: 'across' | 'down';
  wordIndices: {
    across: { start: number; end: number };
    down: { start: number; end: number };
  };
  acrossWord: string;
  downWord: string;
}

export const CellInfo: React.FC<CellInfoProps> = ({
  cell,
  position,
  direction,
  wordIndices,
  acrossWord,
  downWord
}) => {
  const [row, col] = position;

  return (
    <div className="cell-info">
      <h3>Cell Information</h3>
      <div className="info-grid">
        <div className="info-label">Position:</div>
        <div className="info-value">[{row}, {col}]</div>

        <div className="info-label">State:</div>
        <div className="info-value">{cell.state}</div>

        <div className="info-label">Letter:</div>
        <div className="info-value">{cell.letter || '(empty)'}</div>

        <div className="info-label">Direction:</div>
        <div className="info-value">{direction}</div>

        <div className="info-label">Label:</div>
        <div className="info-value">{cell.label || '(none)'}</div>

        <div className="info-label">Across Word:</div>
        <div className="info-value">
          {acrossWord || '(none)'}
          <div className="word-indices">
            [{wordIndices.across.start} - {wordIndices.across.end}]
          </div>
        </div>

        <div className="info-label">Down Word:</div>
        <div className="info-value">
          {downWord || '(none)'}
          <div className="word-indices">
            [{wordIndices.down.start} - {wordIndices.down.end}]
          </div>
        </div>
      </div>
    </div>
  );
}; 