import React, { useState } from 'react';
import { CellInfo } from '../CellInfo';
import { StatsTab } from './StatsTab';
import { DistributionTab } from './DistributionTab';
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
  gridHeight?: number;
}

type TabType = 'info' | 'stats' | 'distribution';

export const CellInfoWrapper: React.FC<CellInfoWrapperProps> = ({
  cell,
  grid,
  position,
  direction,
  wordIndices,
  acrossWord,
  downWord,
  onClueUpdate,
  gridHeight
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
        <button
          className={`tab-button ${activeTab === 'distribution' ? 'active' : ''}`}
          onClick={() => setActiveTab('distribution')}
        >
          Distribution
        </button>
      </div>
      
      <div
        className="tab-content"
        style={gridHeight ? { height: gridHeight } : undefined}
      >
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
        
        {activeTab === 'distribution' && (
          <DistributionTab grid={grid} />
        )}
      </div>
    </div>
  );
}; 