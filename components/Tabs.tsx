
import React from 'react';
import { ActiveTool } from '../types';
import { TOOLS } from '../constants';

interface TabsProps {
  activeTool: ActiveTool;
  onTabClick: (tool: ActiveTool) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTool, onTabClick }) => {
  return (
    <div className="flex justify-center border-b border-slate-700">
      <div className="flex space-x-2 sm:space-x-4" role="tablist">
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onTabClick(tool.id)}
            className={`flex items-center justify-center px-4 py-3 font-medium text-sm sm:text-base transition-colors duration-200 ease-in-out border-b-2
              ${
                activeTool === tool.id
                  ? 'border-indigo-400 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'
              }
            `}
            role="tab"
            aria-selected={activeTool === tool.id}
          >
            {tool.icon}
            {tool.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
