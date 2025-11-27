import React from 'react';
import { Phase } from '../types';
import { PHASE_CONFIG } from '../constants';

interface InfoPanelProps {
  phase: Phase;
  text: string;
  loading: boolean;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ phase, text, loading }) => {
  const config = PHASE_CONFIG[phase];

  return (
    <div className="absolute top-0 left-0 p-6 md:p-8 w-full md:w-1/3 z-20 pointer-events-none">
      <div className="bg-slate-900/80 backdrop-blur-md border-l-4 border-cyan-500 p-6 rounded-r-lg shadow-2xl pointer-events-auto transition-all duration-500 ease-in-out transform translate-x-0">
        <div className="flex items-center gap-2 mb-2">
           <span className="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-cyan-900 text-cyan-300 border border-cyan-700">
             Current Phase
           </span>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-1 leading-tight">
          {config.title}
        </h1>
        <h2 className="text-lg text-cyan-400 font-medium mb-4">
          {config.subtitle}
        </h2>
        
        <div className="relative min-h-[100px]">
           {loading ? (
             <div className="flex items-center gap-3 text-slate-400 animate-pulse">
               <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
               <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce delay-75"></div>
               <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce delay-150"></div>
               <span className="text-sm">AI 正在生成物理讲解...</span>
             </div>
           ) : (
             <p className="text-slate-300 leading-relaxed text-sm md:text-base">
               {text}
             </p>
           )}
        </div>
      </div>
      
      {/* Visual Guide for Grid */}
      <div className="mt-4 pointer-events-auto bg-slate-900/60 backdrop-blur-sm p-4 rounded-lg border border-slate-700 inline-block">
        <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">Visual Guide</h3>
        <div className="flex items-center gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-1">
             <div className="w-3 h-3 border border-cyan-500 bg-cyan-500/20"></div>
             <span>时空网格 (Spacetime)</span>
          </div>
          <div className="flex items-center gap-1">
             <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
             <span>恒星物质</span>
          </div>
        </div>
      </div>
    </div>
  );
};
