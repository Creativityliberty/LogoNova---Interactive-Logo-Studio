
import React, { useState } from 'react';
import { LogoConfig, LogoStyle } from '../types';
import { LOGO_STYLES, FONTS, COLOR_PRESETS, MATERIALS, DIMENSIONS } from '../constants';

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
    fontFamily: 'font-display',
    material: 'liquid_chrome',
    aspectRatio: '1:1'
  });

  const [statusMessage, setStatusMessage] = useState('System Idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!config.businessName || !config.niche) return;
    
    const messages = ['Analyzing Brand DNA...', 'Synthesizing Pigments...', 'Calculating Light Refraction...', 'Optimizing Alpha Blending...'];
    let i = 0;
    const interval = setInterval(() => {
      setStatusMessage(messages[i % messages.length]);
      i++;
    }, 2000);

    onGenerate(config);
    
    setTimeout(() => {
      clearInterval(interval);
      setStatusMessage('Synthesis Complete');
    }, 20000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 glass-pro p-10 rounded-[3rem] shadow-2xl border border-white/5 relative">
      <div className="absolute top-6 right-10 flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-indigo-500 animate-ping' : 'bg-slate-700'}`}></span>
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{statusMessage}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Brand Identity</label>
          <input 
            type="text"
            placeholder="BRAND NAME"
            className="w-full bg-slate-900/30 px-6 py-4 rounded-xl border border-white/5 focus:border-indigo-500 outline-none transition-all text-2xl font-black text-white placeholder:text-slate-800 uppercase tracking-tighter"
            value={config.businessName}
            onChange={(e) => setConfig({...config, businessName: e.target.value})}
            required
          />
        </div>
        <div className="space-y-3">
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Material finish</label>
          <select 
            className="w-full bg-slate-900/30 px-6 py-4 rounded-xl border border-white/5 text-slate-300 font-bold outline-none appearance-none cursor-pointer"
            value={config.material}
            onChange={(e) => setConfig({...config, material: e.target.value})}
          >
            {MATERIALS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Mission & DNA</label>
        <textarea 
          placeholder="What is the soul of this venture? The vibe, the vision..."
          className="w-full bg-slate-900/30 px-6 py-4 rounded-xl border border-white/5 focus:border-indigo-500 outline-none transition-all h-20 resize-none text-sm text-slate-400 font-light"
          value={config.niche}
          onChange={(e) => setConfig({...config, niche: e.target.value})}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="space-y-3">
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Style</label>
          <select 
            className="w-full bg-slate-900/30 px-6 py-4 rounded-xl border border-white/5 text-slate-300 font-bold outline-none"
            value={config.style}
            onChange={(e) => setConfig({...config, style: e.target.value as LogoStyle})}
          >
            {LOGO_STYLES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div className="space-y-3">
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Ratio</label>
          <select 
            className="w-full bg-slate-900/30 px-6 py-4 rounded-xl border border-white/5 text-slate-300 font-bold outline-none"
            value={config.aspectRatio}
            onChange={(e) => setConfig({...config, aspectRatio: e.target.value as any})}
          >
            {DIMENSIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </div>
        <div className="space-y-3">
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Typography</label>
          <select 
            className="w-full bg-slate-900/30 px-6 py-4 rounded-xl border border-white/5 text-slate-300 font-bold outline-none"
            value={config.fontFamily}
            onChange={(e) => setConfig({...config, fontFamily: e.target.value})}
          >
            {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
        </div>
      </div>

      <div className="flex justify-between items-center py-2">
        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Neural Tint</label>
        <div className="flex gap-2">
          {COLOR_PRESETS.map(color => (
            <button
              key={color.value}
              type="button"
              onClick={() => setConfig({...config, primaryColor: color.value})}
              className={`w-8 h-8 rounded-full border-2 ${config.primaryColor === color.value ? 'border-white scale-110' : 'border-transparent opacity-50'}`}
              style={{ backgroundColor: color.value }}
            />
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-white text-black py-5 rounded-2xl font-black text-lg hover:bg-indigo-500 hover:text-white transition-all disabled:opacity-30 shadow-xl group"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-4">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <span className="tracking-[0.2em]">GENERATING ASSETS...</span>
          </div>
        ) : (
          <span className="tracking-[0.2em]">SYNTHESIZE BRAND SYSTEM</span>
        )}
      </button>
    </form>
  );
};

export default GeneratorForm;
