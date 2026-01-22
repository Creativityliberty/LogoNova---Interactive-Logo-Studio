
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
    if (window.innerWidth < 1024) return; // Only tilt on larger desktop screens
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({ x: (y - 0.5) * 5, y: (0.5 - x) * 5 });
  };

  const handleAnimate = async () => {
    if (motionUrl || isAnimating) return;
    setIsAnimating(true);
    try {
      const url = await animateLogo(logo);
      setMotionUrl(url);
      setActiveTab('motion');
    } catch (err) {
      console.error("Motion failed", err);
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
        className="glass-pro rounded-[2rem] md:rounded-[3rem] lg:rounded-[4rem] p-6 md:p-8 lg:p-12 relative transition-all duration-1000 ease-out flex flex-col border border-white/5 overflow-hidden shadow-2xl"
        style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
      >
        {/* Mobile-Friendly Header */}
        <div className="flex justify-between items-center mb-6 md:mb-8 relative z-20">
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-6 bg-indigo-500 rounded-full animate-pulse"></div>
              <span className="text-[9px] font-black text-white uppercase tracking-[0.3em]">{logo.brandStrategy.archetype}</span>
           </div>
           <span className="text-[7px] font-black bg-white/5 text-slate-400 px-3 py-1.5 rounded-full border border-white/5 uppercase tracking-widest">{logo.quality} STREAM</span>
        </div>

        {/* Neural Tabs Scrollable on Mobile */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 mb-8 md:mb-10 relative z-20 pb-2">
          {['visual', 'moodboard', 'narrative', 'motion'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`whitespace-nowrap text-[8px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full border transition-all ${activeTab === tab ? 'bg-white text-black border-white' : 'bg-white/5 text-slate-500 border-white/5 hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 flex flex-col lg:flex-row items-center lg:items-start gap-10 lg:gap-16 xl:gap-20 relative z-10">
          
          {/* Asset Viewer Container */}
          <div className="w-full lg:w-auto flex justify-center lg:justify-start shrink-0">
            <div className={`transition-all duration-1000 ease-out ${isHovered ? 'scale-105' : 'scale-100'}`}>
              
              {activeTab === 'visual' && (
                <div className="w-56 h-56 md:w-72 md:h-72 xl:w-80 xl:h-80 relative flex items-center justify-center">
                   <img src={logo.imageUrl} className="w-full h-full object-contain mix-blend-screen" alt="Logo" />
                   <div className="absolute inset-0 bg-white/5 rounded-full blur-[80px] -z-10 opacity-30"></div>
                </div>
              )}

              {activeTab === 'moodboard' && (
                <div className="w-full max-w-[320px] md:max-w-[400px] grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-4">
                  {logo.moodboard.map((img, i) => (
                    <div key={i} className="rounded-2xl overflow-hidden aspect-video border border-white/10 shadow-xl bg-slate-900/50">
                      <img src={img} className="w-full h-full object-cover grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-700" alt="Mood" />
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'narrative' && (
                <div className="w-full max-w-[320px] md:max-w-[400px] space-y-6 animate-in fade-in zoom-in-95">
                   <div className="p-5 md:p-8 glass-pro rounded-[2rem] border-white/10 space-y-6">
                     <div className="flex justify-between items-center">
                        <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest">Market Status</span>
                        <span className="text-[10px] font-black text-white px-3 py-1 bg-white/10 rounded-lg">{logo.brandStrategy.positioning.pricePoint}</span>
                     </div>
                     <p className="text-[12px] text-slate-300 font-medium leading-relaxed italic">"{logo.brandStrategy.elevatorPitch}"</p>
                     
                     <div className="space-y-4 pt-4 border-t border-white/5">
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Personality Matrix</span>
                        {logo.brandStrategy.personalityTraits.map(p => (
                          <div key={p.trait} className="space-y-1">
                             <div className="flex justify-between text-[7px] font-black text-slate-400 uppercase">
                               <span>{p.trait.split(' vs ')[0]}</span>
                               <span>{p.trait.split(' vs ')[1]}</span>
                             </div>
                             <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${p.value}%` }}></div>
                             </div>
                          </div>
                        ))}
                     </div>
                   </div>
                </div>
              )}

              {activeTab === 'motion' && (
                <div className="w-full max-w-[320px] md:max-w-[450px] aspect-video rounded-[2rem] overflow-hidden bg-black border border-white/10 flex items-center justify-center">
                   {motionUrl ? (
                     <video src={motionUrl} autoPlay loop muted className="w-full h-full object-cover" />
                   ) : (
                     <div className="p-8 text-center space-y-4">
                        <button onClick={handleAnimate} disabled={isAnimating} className="bg-indigo-600 px-6 py-4 rounded-xl text-[9px] font-black uppercase hover:bg-indigo-500 transition-all">
                          {isAnimating ? 'Crunching Motion...' : 'Synthesize 3D Video'}
                        </button>
                     </div>
                   )}
                </div>
              )}
            </div>
          </div>

          {/* Identity Info Area */}
          <div className="w-full flex-1 min-w-0 space-y-8 lg:space-y-10 text-center lg:text-left">
            <div className="space-y-4">
              <h2 className={`text-4xl md:text-6xl xl:text-7xl font-black text-white tracking-tighter leading-none uppercase break-words ${logo.fontFamily}`}>
                {logo.businessName}
              </h2>
              <div className="inline-block px-4 py-2 rounded-xl bg-white text-black max-w-full">
                <p className="text-xs md:text-base font-black tracking-tighter uppercase leading-none truncate">{logo.slogan}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-white/5">
               <div className="space-y-4 overflow-hidden">
                 <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">Visual Keywords</h4>
                 <div className="flex flex-wrap justify-center lg:justify-start gap-1.5 md:gap-2">
                    {logo.brandStrategy.visualKeywords.map(k => (
                      <span key={k} className="px-2.5 py-1 bg-white/5 text-[7px] md:text-[8px] font-black uppercase rounded-lg border border-white/5 text-slate-400 whitespace-nowrap">{k}</span>
                    ))}
                 </div>
                 <div className="flex justify-center lg:justify-start gap-3 mt-4">
                   {logo.palette.map(c => (
                     <div key={c} className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-white/10 shadow-lg shrink-0" style={{ backgroundColor: c }} />
                   ))}
                 </div>
               </div>

               <div className="space-y-4">
                 <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">Strategy</h4>
                 <div className="flex flex-col items-center lg:items-start gap-2">
                    <span className="text-[9px] md:text-[10px] text-slate-300 font-bold uppercase">{logo.brandStrategy.tone} Tone</span>
                    <span className="text-[8px] md:text-[9px] text-indigo-400 uppercase tracking-widest">{logo.brandStrategy.target} Target</span>
                 </div>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4 lg:pt-6">
               <button onClick={() => onInspect(logo)} className="flex-1 bg-slate-900 border border-white/10 py-4 md:py-5 rounded-2xl text-[8px] md:text-[9px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
                 Full Blueprint
               </button>
               <button onClick={() => onDownload(logo)} className="flex-1 bg-indigo-600 text-white py-4 md:py-5 rounded-2xl text-[8px] md:text-[9px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl">
                 Download Assets
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoCard;
