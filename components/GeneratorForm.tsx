
import React, { useState } from 'react';
import { LogoConfig, LogoStyle } from '../types';
import { LOGO_STYLES, FONTS, COLOR_PRESETS, MATERIALS, DIMENSIONS, QUALITY_PRESETS } from '../constants';

interface GeneratorFormProps {
  onGenerate: (config: LogoConfig) => void;
  isLoading: boolean;
}

const GeneratorForm: React.FC<GeneratorFormProps> = ({ onGenerate, isLoading }) => {
  const [config, setConfig] = useState<LogoConfig>({
    businessName: '',
    niche: '',
    style: LogoStyle.LUXURY,
    primaryColor: '#4f46e5',
    fontFamily: 'font-display',
    material: 'liquid_chrome',
    aspectRatio: '1:1',
    quality: '1K'
  });

  const [statusMessage, setStatusMessage] = useState('Neural Idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!config.businessName || !config.niche) return;
    
    const messages = ['Neural Mapping...', 'Resolving Photons...', 'Injecting Material Physics...', 'Synthesizing Identity...'];
    let i = 0;
    const interval = setInterval(() => {
      setStatusMessage(messages[i % messages.length]);
      i++;
    }, 2500);

    onGenerate(config);
    
    setTimeout(() => {
      clearInterval(interval);
      setStatusMessage('Synthesis Complete');
    }, 15000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10 glass-pro p-12 rounded-[4rem] shadow-2xl border border-white/5 relative overflow-hidden">
      {/* Decorative Jauge */}
      <div className="absolute top-0 left-0 w-full h-1 bg-slate-900">
        <div className={`h-full bg-indigo-500 transition-all duration-[20s] ${isLoading ? 'w-full' : 'w-0'}`}></div>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Brand Parameters</h3>
        <div className="flex items-center gap-2">
           <span className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-indigo-500 animate-pulse' : 'bg-slate-700'}`}></span>
           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{statusMessage}</span>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Brand Name</label>
            <input 
              type="text"
              placeholder="ENTER BRAND CORE"
              className="w-full bg-black/40 px-8 py-5 rounded-2xl border border-white/5 focus:border-indigo-500 outline-none transition-all text-2xl font-black text-white placeholder:text-slate-800 uppercase tracking-tighter"
              value={config.businessName}
              onChange={(e) => setConfig({...config, businessName: e.target.value})}
              required
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Neural Quality</label>
            <div className="grid grid-cols-3 gap-2">
              {QUALITY_PRESETS.map(q => (
                <button
                  key={q.value}
                  type="button"
                  onClick={() => setConfig({...config, quality: q.value as any})}
                  className={`py-5 rounded-2xl text-[9px] font-black uppercase transition-all border ${config.quality === q.value ? 'bg-white text-black border-white' : 'bg-white/5 text-slate-500 border-white/5 hover:bg-white/10'}`}
                >
                  {q.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Mission DNA</label>
          <textarea 
            placeholder="Describe the soul of this venture. Impact, vision, vibe..."
            className="w-full bg-black/40 px-8 py-5 rounded-2xl border border-white/5 focus:border-indigo-500 outline-none transition-all h-24 resize-none text-sm text-slate-400 font-light"
            value={config.niche}
            onChange={(e) => setConfig({...config, niche: e.target.value})}
            required
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Aesthetic', value: 'style', options: LOGO_STYLES },
            { label: 'Material', value: 'material', options: MATERIALS },
            { label: 'Typography', value: 'fontFamily', options: FONTS },
            { label: 'Aspect', value: 'aspectRatio', options: DIMENSIONS },
          ].map((field) => (
            <div key={field.value} className="space-y-2">
              <label className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em]">{field.label}</label>
              <select 
                className="w-full bg-black/40 px-4 py-3 rounded-xl border border-white/5 text-[10px] font-bold text-slate-400 outline-none appearance-none"
                value={(config as any)[field.value]}
                onChange={(e) => setConfig({...config, [field.value]: e.target.value})}
              >
                {field.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-white/5">
        <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Neural Tint</label>
        <div className="flex gap-3">
          {COLOR_PRESETS.map(color => (
            <button
              key={color.value}
              type="button"
              onClick={() => setConfig({...config, primaryColor: color.value})}
              className={`w-10 h-10 rounded-full border-2 transition-all ${config.primaryColor === color.value ? 'border-white scale-125' : 'border-transparent opacity-40 hover:opacity-100'}`}
              style={{ backgroundColor: color.value }}
            />
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-white text-black py-7 rounded-[2rem] font-black text-xl hover:bg-indigo-500 hover:text-white transition-all disabled:opacity-30 shadow-[0_20px_50px_rgba(0,0,0,0.3)] group"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-6">
            <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <span className="tracking-[0.3em] uppercase">Synthesizing 4 Proposals</span>
          </div>
        ) : (
          <span className="tracking-[0.3em] uppercase">Synthesize 4 Proposals</span>
        )}
      </button>
    </form>
  );
};

export default GeneratorForm;
