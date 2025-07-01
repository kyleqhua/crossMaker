import React, { useState } from 'react';
import { CellInfo } from '../CellInfo';
import { StatsTab } from './StatsTab';
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

interface CellInfoWrapperProps {
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

type TabType = 'info' | 'stats';

export const CellInfoWrapper: React.FC<CellInfoWrapperProps> = ({
  cell,
  grid,
  position,
  direction,
  wordIndices,
  acrossWord,
  downWord,
  onClueUpdate
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('info');

  return (
    <div className="cell-info-wrapper">
      <div className="tab-header">
        <button
          className={`tab-button ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          Info
        </button>
        <button
          className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          Stats
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'info' && (
          <CellInfo
            cell={cell}
            grid={grid}
            position={position}
            direction={direction}
            wordIndices={wordIndices}
            acrossWord={acrossWord}
            downWord={downWord}
            onClueUpdate={onClueUpdate}
          />
        )}
        
        {activeTab === 'stats' && (
          <StatsTab grid={grid} />
        )}
      </div>
    </div>
  );
}; 