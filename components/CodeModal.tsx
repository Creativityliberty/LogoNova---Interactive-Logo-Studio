
import React, { useState } from 'react';
import { GeneratedLogo } from '../types';

interface CodeModalProps {
  logo: GeneratedLogo;
  onClose: () => void;
}

const CodeModal: React.FC<CodeModalProps> = ({ logo, onClose }) => {
  const [copied, setCopied] = useState(false);

  const reactCode = `
import React, { useState, useRef } from 'react';

// Animation Component for ${logo.businessName}
const BrandLogoInteraction = () => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({ x: (y - 0.5) * 20, y: (0.5 - x) * 20 });
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({x:0, y:0}); }}
      className="perspective-1000 w-full max-w-md p-10 rounded-[3rem] bg-slate-900 border border-white/10 transition-transform duration-300 ease-out"
      style={{ transform: \`rotateX(\${tilt.x}deg) rotateY(\${tilt.y}deg)\` }}
    >
      <div className="flex items-center gap-8">
        <img src="${logo.imageUrl}" className="w-32 h-32 object-contain" alt="Logo" />
        <h2 className="text-4xl font-bold text-white transition-all duration-500" 
            style={{ opacity: hovered ? 1 : 0, transform: hovered ? 'translateX(0)' : 'translateX(-20px)' }}>
          ${logo.businessName}
        </h2>
      </div>
    </div>
  );
};
  `.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(reactCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="glass-pro w-full max-w-4xl max-h-[80vh] rounded-[3rem] border border-white/10 flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-black font-display text-white tracking-tighter">Code Blueprint</h3>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Copy-paste neural interaction</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Code View */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-950/50">
          <div className="relative group">
            <div className="absolute top-4 right-4 z-20">
              <button 
                onClick={handleCopy}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-white text-black hover:bg-indigo-500 hover:text-white'}`}
              >
                {copied ? 'Copied to Clipboard' : 'Copy Snippet'}
              </button>
            </div>
            <pre className="text-indigo-300 font-mono text-sm leading-relaxed p-6 bg-black/40 rounded-2xl border border-white/5 overflow-x-auto selection:bg-indigo-500/30">
              <code>{reactCode}</code>
            </pre>
          </div>

          <div className="mt-8 space-y-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest">Required Styles (Tailwind)</h4>
            <div className="p-4 bg-white/5 rounded-xl text-slate-400 font-mono text-xs">
              perspective-1000, glass-pro, animate-letter-pop
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-900/50 border-t border-white/5 text-center">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Designed for high-performance React environments</p>
        </div>
      </div>
    </div>
  );
};

export default CodeModal;
