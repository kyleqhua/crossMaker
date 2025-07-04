import React, { useState } from 'react';
import './Menu.css';
import { 
  FiPlus, 
  FiFolder, 
  FiDownload, 
  FiRotateCcw, 
  FiRotateCw, 
  FiEye, 
  FiDroplet, 
  FiClipboard, 
  FiTrash2, 
  FiZap, 
  FiMoon, 
  FiHelpCircle 
} from 'react-icons/fi';

interface MenuProps {
  height: number;
  onThemeToggle?: () => void;
  onErase?: () => void;
  onNewPuzzle?: (size: number) => void;
  onSymmetryToggle?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  isSymmetrical?: boolean;
  canUndo?: boolean;
  canRedo?: boolean;
}

// Menu item action functions
const menuActions = {
  newPuzzle: () => console.log('New Puzzle'),
  openPuz: () => console.log('Open .puz'),
  export: () => console.log('Export'),
  undo: () => console.log('Undo'),
  redo: () => console.log('Redo'),
  rebus: () => console.log('Rebus'),
  circleShade: () => console.log('Circle/Shade'),
  clipboard: () => console.log('Clipboard'),
  erase: () => console.log('Erase'),
  symmetry: () => console.log('Symmetry'),
  darkMode: () => console.log('Dark Mode'),
  help: () => console.log('Help'),
};

const menuItems = [
  // File actions
  { label: 'New Puzzle', icon: <FiPlus />, tooltip: 'Create new puzzle', action: 'newPuzzle' },
  { label: 'Open .puz', icon: <FiFolder />, tooltip: 'Open puzzle file', action: 'openPuz' },
  { label: 'Export', icon: <FiDownload />, tooltip: 'Export puzzle', action: 'export' },
  
  // Edit actions
  { label: 'Undo', icon: <FiRotateCcw />, tooltip: 'Undo last action', action: 'undo' },
  { label: 'Redo', icon: <FiRotateCw />, tooltip: 'Redo last action', action: 'redo' },
  
  // View toggles
  { label: 'Rebus', icon: <FiEye />, tooltip: 'Toggle rebus mode', action: 'rebus' },
  { label: 'Circle/Shade', icon: <FiDroplet />, tooltip: 'Toggle circle/shade mode', action: 'circleShade' },
  
  // Tools
  { label: 'Clipboard', icon: <FiClipboard />, tooltip: 'Copy to clipboard', action: 'clipboard' },
  { label: 'Erase', icon: <FiTrash2 />, tooltip: 'Clear puzzle', action: 'erase' },
  { label: 'Symmetry', icon: <FiZap />, tooltip: 'Toggle symmetry off', action: 'symmetry' },
  
  // Settings
  { label: 'Dark Mode', icon: <FiMoon />, tooltip: 'Toggle dark mode', action: 'darkMode' },
  { label: 'Help', icon: <FiHelpCircle />, tooltip: 'Show help', action: 'help' },
];

export const Menu: React.FC<MenuProps> = ({ height, onThemeToggle, onErase, onNewPuzzle, onSymmetryToggle, onUndo, onRedo, isSymmetrical = true, canUndo = false, canRedo = false }) => {
  const [showDropdown, setShowDropdown] = useState(false);


  const handleClick = (action?: string) => {
    if (action === 'darkMode' && onThemeToggle) {
      onThemeToggle();
    }
    if (action === 'erase' && onErase) {
      onErase();
    }
    if (action === 'symmetry' && onSymmetryToggle) {
      onSymmetryToggle();
    }
    if (action === 'undo' && onUndo) {
      onUndo();
    }
    if (action === 'redo' && onRedo) {
      onRedo();
    }
    if (action === 'newPuzzle') {
      setShowDropdown((prev) => !prev);
      return;
    }
    if (action && action in menuActions) {
      menuActions[action as keyof typeof menuActions]();
    }
  };

  const handleNewPuzzle = (rows: number, cols: number) => {
    setShowDropdown(false);
    if (onNewPuzzle) onNewPuzzle(Math.max(rows, cols)); // For now, use square grid
  };

  return (
    <div className="menu-sidebar" style={{ height }}>
      {/* File Actions Group */}
      <div className="menu-group" style={{ position: 'relative' }}>
        {menuItems.slice(0, 3).map((item) => (
          <button
            key={item.label}
            className="menu-btn"
            title={item.tooltip}
            onClick={() => handleClick(item.action)}
          >
            {item.icon}
          </button>
        ))}
        {/* Dropdown for New Puzzle */}
        {showDropdown && (
          <div className="new-puzzle-dropdown">
            <div className="new-puzzle-title">New blank puzzle:</div>
            <div className="new-puzzle-option">
              <button className="new-puzzle-btn"
                onClick={() => handleNewPuzzle(15, 15)}>
                + NYT daily (15×15)
              </button>
            </div>
            <div className="new-puzzle-option">
              <button className="new-puzzle-btn gray"
                onClick={() => handleNewPuzzle(21, 21)}>
                + NYT Sunday (21×21)
              </button>
            </div>
          </div>
        )}
      </div>
      
      <hr className="menu-divider" />
      
      {/* Edit Actions Group */}
      <div className="menu-group">
        {menuItems.slice(3, 5).map((item) => (
          <button
            key={item.label}
            className={`menu-btn ${(item.action === 'undo' && !canUndo) || (item.action === 'redo' && !canRedo) ? 'disabled' : ''}`}
            title={item.tooltip}
            onClick={() => handleClick(item.action)}
            disabled={(item.action === 'undo' && !canUndo) || (item.action === 'redo' && !canRedo)}
          >
            {item.icon}
          </button>
        ))}
      </div>
      
      <hr className="menu-divider" />
      
      {/* View Toggles Group */}
      <div className="menu-group">
        {menuItems.slice(5, 7).map((item) => (
          <button
            key={item.label}
            className="menu-btn"
            title={item.tooltip}
            onClick={() => handleClick(item.action)}
          >
            {item.icon}
          </button>
        ))}
      </div>
      
      <hr className="menu-divider" />
      
      {/* Tools Group */}
      <div className="menu-group">
        {menuItems.slice(7, 10).map((item) => (
          <button
            key={item.label}
            className={`menu-btn ${item.action === 'symmetry' && !isSymmetrical ? 'active' : ''}`}
            title={item.tooltip}
            onClick={() => handleClick(item.action)}
          >
            {item.icon}
          </button>
        ))}
      </div>
      
      <hr className="menu-divider" />
      
      {/* Settings Group */}
      <div className="menu-group">
        {menuItems.slice(10).map((item) => (
          <button
            key={item.label}
            className="menu-btn"
            title={item.tooltip}
            onClick={() => handleClick(item.action)}
          >
            {item.icon}
          </button>
        ))}
      </div>
    </div>
  );
}; 