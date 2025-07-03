import React from 'react';
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
}

const menuItems = [
  // File actions
  { label: 'New Puzzle', icon: <FiPlus />, tooltip: 'Create new puzzle' },
  { label: 'Open .puz', icon: <FiFolder />, tooltip: 'Open puzzle file' },
  { label: 'Export', icon: <FiDownload />, tooltip: 'Export puzzle' },
  
  // Edit actions
  { label: 'Undo', icon: <FiRotateCcw />, tooltip: 'Undo last action' },
  { label: 'Redo', icon: <FiRotateCw />, tooltip: 'Redo last action' },
  
  // View toggles
  { label: 'Rebus', icon: <FiEye />, tooltip: 'Toggle rebus mode' },
  { label: 'Circle/Shade', icon: <FiDroplet />, tooltip: 'Toggle circle/shade mode' },
  
  // Tools
  { label: 'Clipboard', icon: <FiClipboard />, tooltip: 'Copy to clipboard' },
  { label: 'Erase', icon: <FiTrash2 />, tooltip: 'Clear puzzle' },
  { label: 'Symmetry', icon: <FiZap />, tooltip: 'Toggle symmetry' },
  
  // Settings
  { label: 'Dark Mode', icon: <FiMoon />, tooltip: 'Toggle dark mode', action: 'theme' },
  { label: 'Help', icon: <FiHelpCircle />, tooltip: 'Show help' },
];

export const Menu: React.FC<MenuProps> = ({ height, onThemeToggle }) => {
  const handleClick = (action?: string) => {
    if (action === 'theme' && onThemeToggle) {
      onThemeToggle();
    }
    // Add other action handlers here as needed
  };

  return (
    <div className="menu-sidebar" style={{ height }}>
      {/* File Actions Group */}
      <div className="menu-group">
        {menuItems.slice(0, 3).map((item, idx) => (
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
      
      {/* Edit Actions Group */}
      <div className="menu-group">
        {menuItems.slice(3, 5).map((item, idx) => (
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
      
      {/* View Toggles Group */}
      <div className="menu-group">
        {menuItems.slice(5, 7).map((item, idx) => (
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
        {menuItems.slice(7, 10).map((item, idx) => (
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
      
      {/* Settings Group */}
      <div className="menu-group">
        {menuItems.slice(10).map((item, idx) => (
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