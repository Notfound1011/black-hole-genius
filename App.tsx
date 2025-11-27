import React, { useState, useEffect, useCallback } from 'react';
import { Visualizer } from './components/Visualizer';
import { Controls } from './components/Controls';
import { InfoPanel } from './components/InfoPanel';
import { Phase, SimulationState } from './types';
import { fetchExplanation } from './services/ai';
import { PHASE_CONFIG as CONSTANT_PHASE_CONFIG } from './constants';

const App: React.FC = () => {
  const [state, setState] = useState<SimulationState>({
    phase: Phase.MainSequence,
    mass: 15, // Default mass
    isTeacherMode: false,
    isPlaying: true,
    explanation: CONSTANT_PHASE_CONFIG[Phase.MainSequence].defaultText,
    loadingAI: false
  });

  // Fetch AI explanation when phase, mass, or mode changes
  const updateExplanation = useCallback(async (phase: Phase, mass: number, isTeacherMode: boolean) => {
    setState(prev => ({ ...prev, loadingAI: true }));
    
    // Use default text first for immediate feedback if not already loaded
    // But we want to simulate AI thinking, so we show loading state
    
    try {
      const text = await fetchExplanation(phase, mass, isTeacherMode);
      setState(prev => ({ ...prev, explanation: text, loadingAI: false }));
    } catch (e) {
      console.error(e);
      // Fallback to static text
      setState(prev => ({ 
        ...prev, 
        explanation: CONSTANT_PHASE_CONFIG[phase].defaultText, 
        loadingAI: false 
      }));
    }
  }, []);

  // Effect to trigger update on changes (debounced slightly via logic flow)
  useEffect(() => {
    const timer = setTimeout(() => {
        updateExplanation(state.phase, state.mass, state.isTeacherMode);
    }, 500); // 500ms debounce for mass slider
    return () => clearTimeout(timer);
  }, [state.phase, state.mass, state.isTeacherMode, updateExplanation]);

  const handleNext = () => {
    setState(prev => {
      let nextPhase = prev.phase;
      if (prev.phase === Phase.MainSequence) nextPhase = Phase.RedSupergiant;
      else if (prev.phase === Phase.RedSupergiant) nextPhase = Phase.Supernova;
      else if (prev.phase === Phase.Supernova) nextPhase = Phase.Remnant;
      
      return { ...prev, phase: nextPhase };
    });
  };

  const handlePrev = () => {
    setState(prev => {
        let prevPhase = prev.phase;
        if (prev.phase === Phase.Remnant) prevPhase = Phase.Supernova;
        else if (prev.phase === Phase.Supernova) prevPhase = Phase.RedSupergiant;
        else if (prev.phase === Phase.RedSupergiant) prevPhase = Phase.MainSequence;
        
        return { ...prev, phase: prevPhase };
      });
  };

  const handleReset = () => {
    setState(prev => ({ 
        ...prev, 
        phase: Phase.MainSequence 
    }));
  };

  const handleMassChange = (val: number) => {
    setState(prev => ({ ...prev, mass: val }));
  };

  const toggleTeacherMode = () => {
    setState(prev => ({ ...prev, isTeacherMode: !prev.isTeacherMode }));
  };

  return (
    <div className="w-full h-screen flex flex-col bg-slate-900 overflow-hidden">
      {/* Top Section: Visualization & Info */}
      <div className="flex-1 relative">
        <Visualizer phase={state.phase} mass={state.mass} />
        <InfoPanel 
          phase={state.phase} 
          text={state.explanation} 
          loading={state.loadingAI} 
        />
      </div>

      {/* Bottom Section: Controls */}
      <Controls 
        phase={state.phase}
        mass={state.mass}
        isTeacherMode={state.isTeacherMode}
        onMassChange={handleMassChange}
        onNext={handleNext}
        onPrev={handlePrev}
        onReset={handleReset}
        onToggleTeacherMode={toggleTeacherMode}
      />
    </div>
  );
};

export default App;