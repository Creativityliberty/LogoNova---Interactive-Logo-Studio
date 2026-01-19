
import React, { useState } from 'react';
import { LogoConfig, LogoStyle } from '../types';
import { LOGO_STYLES, FONTS, COLOR_PRESETS } from '../constants';

interface GeneratorFormProps {
  onGenerate: (config: LogoConfig) => void;
  isLoading: boolean;
}

const GeneratorForm: React.FC<GeneratorFormProps> = ({ onGenerate, isLoading }) => {
  const [config, setConfig] = useState<LogoConfig>({
    businessName: '',
    niche: '',
    style: LogoStyle.TECH,
    primaryColor: '#6366f1',
    fontFamily: 'font-display'
  });

  const [statusMessage, setStatusMessage] = useState('System Idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!config.businessName || !config.niche) return;
    
    // Aesthetic loading cycle
    const messages = ['Initializing Neural Node...', 'Analyzing Semantic Core...', 'Synthesizing Pigments...', 'Calculating Ink Bleed...'];
    let i = 0;
    const interval = setInterval(() => {
      setStatusMessage(messages[i % messages.length]);
      i++;
    }, 1500);

    onGenerate(config);
    
    // Clear interval when done via effect or simple timeout for now
    setTimeout(() => {
      clearInterval(interval);
      setStatusMessage('Synthesis Complete');
    }, 15000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10 glass-pro p-10 rounded-[3rem] shadow-2xl border border-white/5 relative">
      <div className="absolute top-6 right-10 flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-indigo-500 animate-ping' : 'bg-slate-700'}`}></span>
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{statusMessage}</span>
      </div>

      <div className="space-y-4">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Brand Identity Core</label>
        <input 
          type="text"
          placeholder="ENTER BRAND NAME"
          className="w-full bg-slate-900/30 px-8 py-5 rounded-2xl border border-white/5 focus:border-indigo-500 focus:ring-0 outline-none transition-all text-3xl font-black text-white placeholder:text-slate-800 uppercase tracking-tighter"
          value={config.businessName}
          onChange={(e) => setConfig({...config, businessName: e.target.value})}
          required
        />
      </div>

      <div className="space-y-4">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Mission DNA</label>
        <textarea 
          placeholder="What is the soul of this venture? Describe the impact, the vibe, the vision..."
          className="w-full bg-slate-900/30 px-8 py-5 rounded-2xl border border-white/5 focus:border-indigo-500 focus:ring-0 outline-none transition-all h-32 resize-none text-lg text-slate-400 font-light placeholder:text-slate-800"
          value={config.niche}
          onChange={(e) => setConfig({...config, niche: e.target.value})}
          required
        />
      </div>

      <div className="space-y-6">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Aesthetic Node</label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {LOGO_STYLES.map(style => (
            <button
              key={style.value}
              type="button"
              onClick={() => setConfig({...config, style: style.value as LogoStyle})}
              className={`py-3 px-1 rounded-xl border transition-all text-[9px] font-black uppercase tracking-widest ${config.style === style.value ? 'bg-white text-black border-white' : 'bg-transparent border-white/10 text-slate-600 hover:border-white/20'}`}
            >
              {style.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Typography Pair</label>
          <select 
            className="w-full bg-slate-900/30 px-6 py-4 rounded-xl border border-white/5 text-slate-300 font-bold outline-none appearance-none cursor-pointer"
            value={config.fontFamily}
            onChange={(e) => setConfig({...config, fontFamily: e.target.value})}
          >
            {FONTS.map(font => <option key={font.value} value={font.value}>{font.label}</option>)}
          </select>
        </div>
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Neural Tint</label>
          <div className="flex gap-3 justify-between">
            {COLOR_PRESETS.map(color => (
              <button
                key={color.value}
                type="button"
                onClick={() => setConfig({...config, primaryColor: color.value})}
                className={`w-9 h-9 rounded-full transition-all transform hover:scale-110 relative ${config.primaryColor === color.value ? 'ring-2 ring-white ring-offset-4 ring-offset-slate-950' : ''}`}
                style={{ backgroundColor: color.value }}
              />
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-white text-black py-6 rounded-2xl font-black text-xl hover:bg-indigo-500 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_20px_50px_-10px_rgba(255,255,255,0.1)] active:scale-[0.98] group relative overflow-hidden"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-4">
            <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <span className="tracking-[0.2em]">PROCESSING CORE...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3">
             <span className="tracking-[0.2em]">SYNTHESIZE 4 PROPOSALS</span>
             <svg className="w-5 h-5 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </div>
        )}
      </button>
    </form>
  );
};

export default GeneratorForm;
