
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
    if (window.innerWidth < 1024) return;
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({ x: (y - 0.5) * 4, y: (0.5 - x) * 4 });
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
        className="glass-pro rounded-[2rem] lg:rounded-[3rem] p-6 lg:p-10 relative transition-all duration-1000 ease-out flex flex-col border border-white/5 overflow-hidden shadow-2xl"
        style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
      >
        {/* Header Indicators */}
        <div className="flex justify-between items-center mb-8 relative z-20">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(79,70,229,0.8)]"></div>
              <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">{logo.brandStrategy.archetype}</span>
           </div>
           <div className="flex items-center gap-4">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">ID: {logo.id}</span>
              <span className="text-[8px] font-black bg-white/5 text-indigo-400 px-3 py-1.5 rounded-full border border-indigo-500/20 uppercase tracking-widest">{logo.quality} RENDER</span>
           </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 mb-10 relative z-20">
          {['visual', 'moodboard', 'narrative', 'motion'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`whitespace-nowrap text-[9px] font-black uppercase tracking-[0.2em] px-6 py-3 rounded-xl border transition-all ${activeTab === tab ? 'bg-white text-black border-white scale-105 shadow-xl' : 'bg-white/5 text-slate-500 border-white/5 hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 flex flex-col xl:flex-row gap-12 xl:gap-20 relative z-10">
          
          {/* Main Visual Component */}
          <div className="w-full xl:w-[45%] flex justify-center items-center bg-black/40 rounded-[2rem] border border-white/5 p-8 min-h-[350px] relative overflow-hidden group-hover:border-indigo-500/20 transition-colors">
            <div className={`transition-all duration-1000 ease-out ${isHovered ? 'scale-110 rotate-1' : 'scale-100'}`}>
              
              {activeTab === 'visual' && (
                <div className="w-64 h-64 md:w-80 md:h-80 relative flex items-center justify-center">
                   <img src={logo.imageUrl} className="w-full h-full object-contain mix-blend-screen drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]" alt="Logo" />
                   <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-[100px] -z-10 opacity-40"></div>
                </div>
              )}

              {activeTab === 'moodboard' && (
                <div className="w-full max-w-[400px] grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-4">
                  {logo.moodboard.map((img, i) => (
                    <div key={i} className="rounded-2xl overflow-hidden aspect-video border border-white/10 shadow-2xl bg-slate-900">
                      <img src={img} className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-1000" alt="Mood" />
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'narrative' && (
                <div className="w-full max-w-[420px] space-y-6 animate-in fade-in zoom-in-95">
                   <div className="p-8 glass-pro rounded-[2.5rem] border-white/10 space-y-8">
                     <div className="flex justify-between items-center border-b border-white/5 pb-4">
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Market Status</span>
                        <span className="text-[11px] font-black text-white px-4 py-1.5 bg-indigo-500/20 rounded-lg border border-indigo-500/30 uppercase">{logo.brandStrategy.positioning.pricePoint}</span>
                     </div>
                     <p className="text-[14px] text-slate-300 font-medium leading-relaxed italic text-center">"{logo.brandStrategy.elevatorPitch}"</p>
                     
                     <div className="space-y-5 pt-4">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">Personality Matrix</span>
                        {logo.brandStrategy.personalityTraits.map(p => (
                          <div key={p.trait} className="space-y-2">
                             <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-wider">
                               <span>{p.trait.split(' vs ')[0]}</span>
                               <span>{p.trait.split(' vs ')[1]}</span>
                             </div>
                             <div className="h-1.5 bg-slate-900/50 rounded-full overflow-hidden border border-white/5">
                                <div className="h-full bg-gradient-to-r from-indigo-600 to-blue-400 shadow-[0_0_10px_rgba(79,70,229,0.5)] transition-all duration-[1.5s] ease-out" style={{ width: isHovered ? `${p.value}%` : '0%' }}></div>
                             </div>
                          </div>
                        ))}
                     </div>
                   </div>
                </div>
              )}

              {activeTab === 'motion' && (
                <div className="w-full max-w-[500px] aspect-video rounded-[2.5rem] overflow-hidden bg-black border border-white/10 flex items-center justify-center relative shadow-2xl">
                   {motionUrl ? (
                     <video src={motionUrl} autoPlay loop muted className="w-full h-full object-cover" />
                   ) : (
                     <div className="p-10 text-center space-y-6">
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Motion DNA Empty</p>
                        <button onClick={handleAnimate} disabled={isAnimating} className="bg-white text-black px-8 py-5 rounded-2xl text-[10px] font-black uppercase hover:bg-indigo-500 hover:text-white transition-all shadow-xl disabled:opacity-20">
                          {isAnimating ? 'Encoding Reveal...' : 'Synthesize 3D Reveal'}
                        </button>
                     </div>
                   )}
                </div>
              )}
            </div>
          </div>

          {/* Identity Information Panel */}
          <div className="flex-1 flex flex-col justify-between space-y-12">
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className={`text-[clamp(2.5rem,8vw,5.5rem)] font-black text-white tracking-tighter leading-[0.9] uppercase transition-all duration-700 ${logo.fontFamily}`}>
                  {logo.businessName}
                </h2>
                <div className="inline-block px-5 py-2.5 rounded-xl bg-white text-black shadow-xl">
                  <p className="text-sm md:text-lg font-black tracking-tighter uppercase leading-none">{logo.slogan}</p>
                </div>
              </div>
              
              <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xl opacity-80">
                {logo.brandStrategy.socialBio}
              </p>
            </div>

            {/* Strategic Meta Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-10 border-y border-white/5 bg-white/[0.02] -mx-4 px-4 rounded-[2rem]">
               <div className="space-y-5">
                 <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Visual Keywords</h4>
                 <div className="flex flex-wrap gap-2">
                    {logo.brandStrategy.visualKeywords.map(k => (
                      <span key={k} className="px-3.5 py-1.5 bg-indigo-500/5 text-[9px] font-black uppercase rounded-xl border border-indigo-500/10 text-indigo-300 hover:bg-indigo-500/10 transition-colors">{k}</span>
                    ))}
                 </div>
                 <div className="flex gap-3 pt-4">
                   {logo.palette.map(c => (
                     <div key={c} className="group relative">
                        <div className="w-10 h-10 rounded-2xl border border-white/10 shadow-lg transform transition-transform group-hover:scale-110 group-hover:-rotate-6" style={{ backgroundColor: c }} />
                        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[7px] font-black opacity-0 group-hover:opacity-100 transition-opacity uppercase">{c}</span>
                     </div>
                   ))}
                 </div>
               </div>

               <div className="space-y-6">
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Strategy Core</h4>
                 <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-1">
                      <span className="text-[8px] text-indigo-500 uppercase font-black tracking-widest">Brand Voice</span>
                      <p className="text-xs text-white font-bold uppercase tracking-tighter">{logo.brandStrategy.tone}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[8px] text-indigo-500 uppercase font-black tracking-widest">Ideal Target</span>
                      <p className="text-xs text-white font-bold uppercase tracking-tighter">{logo.brandStrategy.target}</p>
                    </div>
                 </div>
               </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
               <button 
                onClick={() => onInspect(logo)} 
                className="flex-1 group bg-slate-900 border border-white/10 py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3"
               >
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" strokeWidth="2.5"/></svg>
                 Inspect Blueprint
               </button>
               <button 
                onClick={() => onDownload(logo)} 
                className="flex-1 bg-indigo-600 text-white py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-500 transition-all shadow-[0_20px_40px_rgba(79,70,229,0.2)] flex items-center justify-center gap-3"
               >
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth="2.5"/></svg>
                 Export Assets
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoCard;
