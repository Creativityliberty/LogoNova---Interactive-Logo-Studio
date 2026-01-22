
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
  const [activeTab, setActiveTab] = useState<'visual' | 'moodboard' | 'narrative' | 'motion'>('visual');
  const [motionUrl, setMotionUrl] = useState<string | null>(logo.motionUrl || null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({ x: (y - 0.5) * 10, y: (0.5 - x) * 10 });
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

  return (
    <div className="perspective-2000 w-full group">
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setTilt({x:0,y:0}); }}
        className="glass-pro rounded-[4.5rem] p-12 relative transition-all duration-1000 ease-out min-h-[650px] flex flex-col border border-white/5 overflow-hidden shadow-2xl"
        style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
      >
        {/* Archetype Indicator */}
        <div className="absolute top-10 left-12 z-20 flex items-center gap-3">
           <div className="w-1.5 h-6 bg-indigo-500 rounded-full animate-pulse"></div>
           <span className="text-[9px] font-black text-white uppercase tracking-[0.5em]">{logo.brandStrategy.archetype}</span>
        </div>

        {/* Quality Badge */}
        <div className="absolute top-8 right-12 z-20">
           <span className="text-[7px] font-black bg-white/5 text-slate-400 px-3 py-1.5 rounded-full border border-white/5 uppercase tracking-widest">{logo.quality} Neural Stream</span>
        </div>

        {/* Neural Tabs */}
        <div className="flex flex-wrap gap-2 mb-16 relative z-20 mt-8">
          {['visual', 'moodboard', 'narrative', 'motion'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`text-[8px] font-black uppercase tracking-[0.4em] px-6 py-2.5 rounded-full border transition-all ${activeTab === tab ? 'bg-white text-black border-white' : 'bg-white/5 text-slate-500 border-white/5 hover:border-white/20 hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 flex flex-col md:flex-row items-center gap-24 relative z-10">
          
          {/* Asset Viewer */}
          <div className="relative group/view">
            <div className={`transition-all duration-1000 ease-out ${isHovered ? 'scale-110 drop-shadow-[0_0_80px_rgba(255,255,255,0.1)]' : 'scale-100'}`}>
              
              {activeTab === 'visual' && (
                <div className="w-80 h-80 relative flex items-center justify-center">
                   <img src={logo.imageUrl} className="w-full h-full object-contain mix-blend-screen" alt="Isolated Logo" />
                   <div className="absolute inset-0 bg-white/5 rounded-full blur-[100px] -z-10 group-hover/view:bg-white/10 transition-colors"></div>
                </div>
              )}

              {activeTab === 'moodboard' && (
                <div className="w-96 grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-right-8">
                  {logo.moodboard.map((img, i) => (
                    <div key={i} className="rounded-3xl overflow-hidden aspect-video border border-white/10 shadow-xl group/img">
                      <img src={img} className="w-full h-full object-cover grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-700" alt={`Moodboard ${i}`} />
                    </div>
                  ))}
                  {logo.moodboard.length === 0 && <p className="text-[10px] text-slate-500 uppercase">Generating visuals...</p>}
                </div>
              )}

              {activeTab === 'motion' && (
                <div className="w-full max-w-[450px] aspect-video rounded-[3rem] overflow-hidden shadow-2xl bg-black border border-white/10">
                   {motionUrl ? (
                     <video src={motionUrl} autoPlay loop muted className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center space-y-8">
                        <div className="relative">
                          <div className="w-20 h-20 border-2 border-dashed border-indigo-500/30 rounded-full animate-spin"></div>
                          <div className="absolute inset-0 flex items-center justify-center text-indigo-500 font-black text-[10px]">VE</div>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Awaiting Motion Vector</p>
                          <button onClick={handleAnimate} disabled={isAnimating} className="bg-indigo-600 px-8 py-4 rounded-2xl text-[9px] font-black uppercase hover:bg-indigo-500 transition-all flex items-center gap-3">
                            {isAnimating ? 'Crunching Frames...' : 'Synthesize 1080p Motion'}
                          </button>
                        </div>
                     </div>
                   )}
                </div>
              )}

              {activeTab === 'narrative' && (
                <div className="w-80 space-y-6 animate-in fade-in zoom-in-95">
                   <div className="p-8 glass-pro rounded-[3rem] border-white/10 space-y-6">
                     <div>
                       <span className="text-[8px] font-black text-indigo-500 uppercase tracking-[0.4em]">The Pitch</span>
                       <p className="text-[12px] text-slate-300 font-medium leading-relaxed mt-2">{logo.brandStrategy.elevatorPitch}</p>
                     </div>
                     <div className="pt-6 border-t border-white/5">
                        <span className="text-[8px] font-black text-indigo-500 uppercase tracking-[0.4em]">Core Values</span>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {logo.brandStrategy.values.map(v => (
                            <span key={v} className="px-3 py-1 bg-white/5 rounded-full text-[9px] text-white border border-white/5 uppercase font-black">{v}</span>
                          ))}
                        </div>
                     </div>
                   </div>
                </div>
              )}
            </div>
          </div>

          {/* Identity Core Area */}
          <div className="flex-1 space-y-12 text-center md:text-left">
            <div className={`transition-all duration-1000 ${isHovered ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`}>
              <h2 className={`text-9xl font-black text-white tracking-tighter leading-none mb-6 uppercase ${logo.fontFamily}`}>
                {logo.businessName}
              </h2>
              <div className="inline-block px-6 py-3 rounded-2xl bg-white text-black shadow-[0_20px_40px_rgba(255,255,255,0.1)]">
                <p className="text-xl font-black tracking-tighter uppercase leading-none">{logo.slogan}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-12 pt-8 border-t border-white/5">
               <div className="space-y-6">
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Neural Palette</h4>
                 <div className="flex flex-wrap gap-4">
                   {logo.palette.map(c => (
                     <div key={c} className="group/pal relative">
                        <div className="w-12 h-12 rounded-2xl shadow-xl border border-white/5 hover:scale-110 transition-transform cursor-pointer" style={{ backgroundColor: c }} />
                        <span className="absolute -bottom-6 left-0 text-[7px] font-mono text-slate-600 opacity-0 group-hover/pal:opacity-100 transition-opacity uppercase">{c}</span>
                     </div>
                   ))}
                 </div>
               </div>
               <div className="space-y-6">
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Tone & Bio</h4>
                 <p className="text-[11px] text-slate-400 leading-relaxed max-w-[250px] font-medium">
                   {logo.brandStrategy.socialBio}
                 </p>
                 <div className="flex items-center gap-4">
                   <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{logo.brandStrategy.tone}</span>
                   <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{logo.brandStrategy.target}</span>
                 </div>
               </div>
            </div>

            {/* Global Actions */}
            <div className={`flex flex-wrap gap-4 pt-8 transition-all duration-1000 delay-300 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
               <button onClick={() => onInspect(logo)} className="flex-1 bg-slate-900 border border-white/10 py-6 rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.4em] hover:bg-slate-800 transition-all flex items-center justify-center gap-3">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" strokeWidth="2.5"/></svg>
                 Blueprint
               </button>
               <button onClick={() => onDownload(logo)} className="flex-1 bg-indigo-600 text-white py-6 rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.4em] hover:bg-indigo-500 transition-all shadow-2xl flex items-center justify-center gap-3">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth="2.5"/></svg>
                 Package
               </button>
            </div>
          </div>
        </div>

        {/* Scan-line overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-5 overflow-hidden">
           <div className="w-full h-20 bg-gradient-to-b from-transparent via-white to-transparent -translate-y-full animate-scan"></div>
        </div>
      </div>
    </div>
  );
};

export default LogoCard;
