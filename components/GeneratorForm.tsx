
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
    
    const messages = ['Mapping Market Position...', 'Resolving Neutrons...', 'Finalizing Branding...'];
    let i = 0;
    const interval = setInterval(() => {
      setStatusMessage(messages[i % messages.length]);
      i++;
    }, 4000);

    onGenerate(config);
    
    setTimeout(() => {
      clearInterval(interval);
      setStatusMessage('Synthesis Complete');
    }, 20000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 md:space-y-10 glass-pro p-6 md:p-12 rounded-[2rem] md:rounded-[4rem] shadow-2xl border border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-slate-900">
        <div className={`h-full bg-indigo-500 transition-all duration-[25s] ease-linear ${isLoading ? 'w-full' : 'w-0'}`}></div>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Parameters</h3>
        <div className="flex items-center gap-2">
           <span className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-indigo-500 animate-pulse' : 'bg-slate-700'}`}></span>
           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{statusMessage}</span>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Brand Name</label>
            <input 
              type="text"
              placeholder="ENTER BRAND"
              className="w-full bg-black/40 px-6 py-4 rounded-xl border border-white/5 focus:border-indigo-500 outline-none transition-all text-xl md:text-2xl font-black text-white placeholder:text-slate-800 uppercase tracking-tighter"
              value={config.businessName}
              onChange={(e) => setConfig({...config, businessName: e.target.value})}
              required
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Preset</label>
            <div className="grid grid-cols-3 gap-2">
              {QUALITY_PRESETS.map(q => (
                <button
                  key={q.value}
                  type="button"
                  onClick={() => setConfig({...config, quality: q.value as any})}
                  className={`py-4 rounded-xl text-[8px] font-black uppercase transition-all border ${config.quality === q.value ? 'bg-white text-black border-white' : 'bg-white/5 text-slate-500 border-white/5'}`}
                >
                  {q.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Brand Core & Mission</label>
          <textarea 
            placeholder="What do you build? Who is it for? What is the vibe?"
            className="w-full bg-black/40 px-6 py-4 rounded-xl border border-white/5 focus:border-indigo-500 outline-none transition-all h-24 resize-none text-sm text-slate-400"
            value={config.niche}
            onChange={(e) => setConfig({...config, niche: e.target.value})}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Style', value: 'style', options: LOGO_STYLES },
            { label: 'Physics', value: 'material', options: MATERIALS },
            { label: 'Typeface', value: 'fontFamily', options: FONTS },
            { label: 'Format', value: 'aspectRatio', options: DIMENSIONS },
          ].map((field) => (
            <div key={field.value} className="space-y-2">
              <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{field.label}</label>
              <select 
                className="w-full bg-black/40 px-3 py-3 rounded-xl border border-white/5 text-[9px] font-bold text-slate-400 outline-none appearance-none"
                value={(config as any)[field.value]}
                onChange={(e) => setConfig({...config, [field.value]: e.target.value})}
              >
                {field.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 pt-4 border-t border-white/5">
        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Neural Tint</label>
        <div className="flex flex-wrap gap-3">
          {COLOR_PRESETS.map(color => (
            <button
              key={color.value}
              type="button"
              onClick={() => setConfig({...config, primaryColor: color.value})}
              className={`w-8 h-8 rounded-full border-2 transition-all ${config.primaryColor === color.value ? 'border-white scale-125' : 'border-transparent opacity-40'}`}
              style={{ backgroundColor: color.value }}
            />
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-white text-black py-6 rounded-2xl font-black text-lg hover:bg-indigo-500 hover:text-white transition-all disabled:opacity-30 shadow-2xl uppercase tracking-widest"
      >
        {isLoading ? 'Synthesizing...' : 'Generate Brand'}
      </button>
    </form>
  );
};

export default GeneratorForm;
