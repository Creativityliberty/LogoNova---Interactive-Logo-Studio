
import React, { useState } from 'react';
import { GeneratedLogo } from '../types';

interface CodeModalProps {
  logo: GeneratedLogo;
  onClose: () => void;
}

const CodeModal: React.FC<CodeModalProps> = ({ logo, onClose }) => {
  const [copied, setCopied] = useState(false);

  const brandProfile = {
    identity: {
      name: logo.businessName,
      slogan: logo.slogan,
      niche: logo.description,
      archetype: logo.brandStrategy.archetype,
    },
    strategy: {
      positioning: logo.brandStrategy.positioning,
      values: logo.brandStrategy.values,
      traits: logo.brandStrategy.personalityTraits,
    },
    visual: {
      palette: logo.palette,
      font: logo.fontFamily,
      keywords: logo.brandStrategy.visualKeywords,
    }
  };

  const jsonBlueprint = JSON.stringify(brandProfile, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonBlueprint);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="glass-pro w-full max-w-5xl max-h-[90vh] rounded-[2rem] md:rounded-[4rem] border border-white/10 flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 md:p-10 border-b border-white/5 flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-xl md:text-3xl font-black font-display text-white tracking-tighter uppercase">Brand Blueprint</h3>
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.4em] mt-2">Neural Strategy & Design Data</p>
          </div>
          <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
             <div className="space-y-6">
                <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Brand Positioning</h4>
                <div className="space-y-4">
                   <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                      <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Mission</p>
                      <p className="text-slate-300 text-sm italic">"{logo.brandStrategy.mission}"</p>
                   </div>
                   <div className="p-4 bg-white/5 rounded-xl border border-white/5 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[8px] text-slate-500 uppercase font-black mb-1">Archetype</p>
                        <p className="text-white text-xs font-bold">{logo.brandStrategy.archetype}</p>
                      </div>
                      <div>
                        <p className="text-[8px] text-slate-500 uppercase font-black mb-1">Target</p>
                        <p className="text-white text-xs font-bold">{logo.brandStrategy.target}</p>
                      </div>
                   </div>
                </div>
             </div>

             <div className="space-y-6">
                <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Design Blueprint (JSON)</h4>
                <div className="relative group">
                  <button 
                    onClick={handleCopy}
                    className={`absolute top-4 right-4 z-20 px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-white text-black'}`}
                  >
                    {copied ? 'Copied' : 'Copy JSON'}
                  </button>
                  <pre className="text-indigo-300 font-mono text-[10px] md:text-xs leading-relaxed p-6 bg-black/60 rounded-2xl border border-white/5 overflow-x-auto h-[300px] no-scrollbar">
                    <code>{jsonBlueprint}</code>
                  </pre>
                </div>
             </div>
          </div>

          <div className="pt-10 border-t border-white/5 text-center">
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">This blueprint is ready for production implementation</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeModal;
