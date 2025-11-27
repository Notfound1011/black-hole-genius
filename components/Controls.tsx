import React from 'react';
import { Phase, MIN_MASS, MAX_MASS, MASS_THRESHOLD_BLACK_HOLE } from '../types';
import { ChevronRight, ChevronLeft, RefreshCw, BookOpen, GraduationCap } from 'lucide-react';

interface ControlsProps {
  phase: Phase;
  mass: number;
  isTeacherMode: boolean;
  onMassChange: (val: number) => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  onToggleTeacherMode: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  phase,
  mass,
  isTeacherMode,
  onMassChange,
  onNext,
  onPrev,
  onReset,
  onToggleTeacherMode
}) => {
  
  const isRemnant = phase === Phase.Remnant;
  const isInteractable = phase !== Phase.Supernova; // Disable slider during explosion mostly for logic simplicity

  return (
    <div className="bg-slate-800/90 backdrop-blur-md border-t border-slate-700 p-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between shadow-2xl z-10 relative">
      
      {/* Mass Slider Section */}
      <div className="flex-1 max-w-md">
        <div className="flex justify-between items-end mb-2">
          <label className="text-cyan-400 font-semibold flex items-center gap-2">
             <span className="text-lg">恒星质量 (Mass)</span>
          </label>
          <span className="text-2xl font-bold text-white font-mono">{mass} M☉</span>
        </div>
        <input 
          type="range" 
          min={MIN_MASS} 
          max={MAX_MASS} 
          step={1}
          value={mass}
          disabled={!isInteractable}
          onChange={(e) => onMassChange(Number(e.target.value))}
          className={`w-full h-3 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400 transition-all ${!isInteractable ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        <div className="flex justify-between text-xs text-slate-400 mt-2 font-mono">
           <span>{MIN_MASS}x (中子星)</span>
           <span className="text-red-400 font-bold">{MASS_THRESHOLD_BLACK_HOLE}x (黑洞阈值)</span>
           <span>{MAX_MASS}x (巨型黑洞)</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        
        <button 
          onClick={onToggleTeacherMode}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${isTeacherMode ? 'bg-purple-600 border-purple-400 text-white' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
          title="切换讲解深度"
        >
          {isTeacherMode ? <GraduationCap size={18} /> : <BookOpen size={18} />}
          <span>{isTeacherMode ? '教师模式' : '学生模式'}</span>
        </button>

        <div className="h-8 w-px bg-slate-600 mx-2 hidden md:block"></div>

        <button 
          onClick={onPrev}
          disabled={phase === Phase.MainSequence}
          className="p-3 rounded-full bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-colors"
        >
          <ChevronLeft size={24} />
        </button>

        {isRemnant ? (
           <button 
             onClick={onReset}
             className="flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-lg shadow-cyan-500/20 transition-all"
           >
             <RefreshCw size={20} />
             <span>重置模拟</span>
           </button>
        ) : (
          <button 
            onClick={onNext}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-lg shadow-cyan-500/20 transition-all"
          >
            <span>下一步</span>
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
};
