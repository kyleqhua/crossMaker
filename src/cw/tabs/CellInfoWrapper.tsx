import React, { useState } from 'react';
import { FiInfo, FiBarChart, FiPieChart } from 'react-icons/fi';
import { CellInfo } from './CellInfo';
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

const tabs = [
  { id: 'info' as TabType, label: 'Info', icon: <FiInfo />, tooltip: 'Cell information and clues' },
  { id: 'stats' as TabType, label: 'Stats', icon: <FiBarChart />, tooltip: 'Puzzle statistics' },
  { id: 'distribution' as TabType, label: 'Distribution', icon: <FiPieChart />, tooltip: 'Word length distribution' },
];

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
      <div className="tab-header" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            title={tab.tooltip}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
      
      <div
        className="tab-content"
        style={gridHeight ? { height: gridHeight } : undefined}
      >
        {activeTab === 'info' && (
          <div role="tabpanel" id="tabpanel-info" aria-labelledby="tab-info">
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
          </div>
        )}
        
        {activeTab === 'stats' && (
          <div role="tabpanel" id="tabpanel-stats" aria-labelledby="tab-stats">
            <StatsTab grid={grid} />
          </div>
        )}
        
        {activeTab === 'distribution' && (
          <div role="tabpanel" id="tabpanel-distribution" aria-labelledby="tab-distribution">
            <DistributionTab grid={grid} />
          </div>
        )}
      </div>
    </div>
  );
}; 