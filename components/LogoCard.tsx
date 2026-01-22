
import React, { useState, useRef } from 'react';
import { GeneratedLogo } from '../types';
import { animateLogo } from '../services/geminiService';

interface LogoCardProps {
  logo: GeneratedLogo;
  onDownload: (logo: GeneratedLogo) => void;
  onInspect: (logo: GeneratedLogo) => void;
  index: number;
}

const LogoCard: React.FC<LogoCardProps> = ({ logo, onDownload, onInspect, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeTab, setActiveTab] = useState<'visual' | 'mockup' | 'strategy' | 'motion'>('visual');
  const [motionUrl, setMotionUrl] = useState<string | null>(logo.motionUrl || null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mockupType, setMockupType] = useState<'card' | 'phone' | 'store'>('card');
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({ x: (y - 0.5) * 15, y: (0.5 - x) * 15 });
  };

  const handleAnimate = async () => {
    if (motionUrl || isAnimating) return;
    setIsAnimating(true);
    try {
      const url = await animateLogo(logo);
      setMotionUrl(url);
      setActiveTab('motion');
    } catch (err) {
      console.error("Motion synthesis failed", err);
    } finally {
      setIsAnimating(false);
    }
  };

  const renderAnimatedName = (name: string) => {
    return name.split('').map((char, i) => (
      <span key={i} className="animate-letter opacity-0" style={{ animationDelay: `${i * 40}ms` }}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <div className="perspective-2000 w-full group">
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setTilt({x:0,y:0}); }}
        className="glass-pro rounded-[4rem] p-12 relative transition-all duration-1000 ease-out min-h-[550px] flex flex-col border border-white/5 overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)]"
        style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
      >
        {/* Background Spotlight */}
        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${isHovered ? 'opacity-40' : 'opacity-10'}`}
             style={{ background: `radial-gradient(circle at 50% 50%, ${logo.palette[0] || '#4f46e5'}, transparent 70%)` }} />

        {/* Floating Controls */}
        <div className="flex flex-wrap gap-2 mb-10 relative z-20">
          {['visual', 'mockup', 'strategy', 'motion'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`text-[8px] font-black uppercase tracking-[0.3em] px-5 py-2.5 rounded-full border transition-all ${activeTab === tab ? 'bg-white text-black border-white' : 'bg-white/5 text-slate-500 border-white/5 hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Core Content */}
        <div className="flex-1 flex flex-col md:flex-row items-center gap-16 relative z-10">
          
          {/* Visual Container */}
          <div className="relative group/view">
            <div className={`transition-all duration-1000 ease-out ${isHovered ? 'scale-110 drop-shadow-[0_0_50px_rgba(255,255,255,0.2)]' : 'scale-100'}`}>
              
              {activeTab === 'visual' && (
                <div className="w-64 h-64 relative flex items-center justify-center">
                   {/* Alpha Blending magic: PURE BLACK background becomes transparent with screen */}
                   <img 
                    src={logo.imageUrl} 
                    className="w-full h-full object-contain mix-blend-screen" 
                    alt="Logo Isolated" 
                  />
                  {/* Spotlight on logo */}
                  <div className="absolute inset-0 bg-white/5 rounded-full blur-2xl -z-10 group-hover/view:bg-white/10 transition-colors"></div>
                </div>
              )}

              {activeTab === 'mockup' && (
                <div className="w-72 h-48 bg-slate-900 rounded-2xl overflow-hidden border border-white/10 relative shadow-2xl">
                   {mockupType === 'card' && (
                     <div className="w-full h-full bg-slate-100 p-8 flex items-center justify-center relative">
                        <img src={logo.imageUrl} className="w-20 mix-blend-multiply opacity-80" alt="Card mockup" />
                        <div className="absolute bottom-6 right-6 text-[8px] font-black text-black opacity-30 uppercase">Neural Brand Systems</div>
                     </div>
                   )}
                   {mockupType === 'phone' && (
                     <div className="w-full h-full bg-black flex flex-col items-center justify-center p-4">
                        <div className="w-16 h-16 rounded-2xl bg-white p-2 mb-2">
                          <img src={logo.imageUrl} className="w-full h-full mix-blend-multiply" alt="Icon" />
                        </div>
                        <div className="text-[6px] text-white/50 uppercase tracking-widest">{logo.businessName}</div>
                     </div>
                   )}
                   <div className="absolute top-2 right-2 flex gap-1">
                      {['card', 'phone'].map(t => (
                        <button key={t} onClick={() => setMockupType(t as any)} className={`w-4 h-4 rounded-full border border-white/20 text-[6px] flex items-center justify-center ${mockupType === t ? 'bg-white text-black' : 'bg-black text-white'}`}>
                          {t[0].toUpperCase()}
                        </button>
                      ))}
                   </div>
                </div>
              )}

              {activeTab === 'motion' && (
                <div className="w-80 aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black border border-white/5">
                   {motionUrl ? (
                     <video src={motionUrl} autoPlay loop muted className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
                        <div className="w-12 h-12 border-2 border-dashed border-indigo-500 rounded-full animate-spin"></div>
                        <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Awaiting synthesis</p>
                        <button onClick={handleAnimate} disabled={isAnimating} className="bg-indigo-600 px-6 py-2 rounded-lg text-[9px] font-black uppercase">Start Motion Build</button>
                     </div>
                   )}
                </div>
              )}
            </div>
          </div>

          {/* Identity Info */}
          <div className="flex-1 space-y-8 text-center md:text-left">
            <div className={`transition-all duration-700 ${isHovered ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`}>
              <h2 className={`text-7xl font-black text-white tracking-tighter leading-none mb-3 uppercase ${logo.fontFamily}`}>
                {isHovered ? renderAnimatedName(logo.businessName) : logo.businessName}
              </h2>
              <p className="text-xl font-light italic text-indigo-400/80 tracking-tight">"{logo.slogan}"</p>
            </div>

            {activeTab === 'visual' && (
               <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Primary Palette</h4>
                    <div className="flex gap-2">
                      {logo.palette.map(c => <div key={c} className="w-8 h-8 rounded-lg shadow-inner" style={{ backgroundColor: c }} title={c} />)}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Archetype</h4>
                    <span className="text-sm font-bold text-white uppercase tracking-tighter bg-white/5 px-4 py-2 rounded-xl border border-white/5">{logo.brandStrategy.archetype}</span>
                  </div>
               </div>
            )}

            {activeTab === 'strategy' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-4">
                  <div>
                    <span className="text-[8px] font-black text-indigo-500 uppercase">Brand Tone</span>
                    <p className="text-2xl font-black text-white uppercase">{logo.brandStrategy.tone}</p>
                  </div>
                  <div>
                    <span className="text-[8px] font-black text-indigo-500 uppercase">Mission Statement</span>
                    <p className="text-sm text-slate-400 leading-relaxed font-light">"{logo.description}"</p>
                  </div>
                </div>
              </div>
            )}

            {/* Final Actions */}
            <div className={`flex flex-wrap gap-4 pt-4 transition-all duration-1000 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
               <button onClick={() => onInspect(logo)} className="flex-1 bg-slate-900 border border-white/10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 flex items-center justify-center gap-2">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" strokeWidth="2"/></svg>
                 Code Blueprint
               </button>
               <button onClick={() => onDownload(logo)} className="flex-1 bg-white text-black py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white flex items-center justify-center gap-2 shadow-2xl">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth="2"/></svg>
                 Export Assets
               </button>
            </div>
          </div>
        </div>

        {/* Neural Grain Overlay */}
        <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20 print-texture"></div>
      </div>
    </div>
  );
};

export default LogoCard;
