
import React, { useState, useRef, useEffect } from 'react';
import { GeneratedLogo } from '../types';

interface LogoCardProps {
  logo: GeneratedLogo;
  onDownload: (logo: GeneratedLogo) => void;
  index: number;
}

const LogoCard: React.FC<LogoCardProps> = ({ logo, onDownload, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showMockup, setShowMockup] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || showMockup) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  // Staggered letter animation helper
  const renderAnimatedName = (name: string) => {
    return name.split('').map((char, i) => (
      <span 
        key={i} 
        className="animate-letter opacity-0" 
        style={{ animationDelay: `${i * 30}ms` }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <div className="perspective-2000 w-full group">
      <div 
        ref={cardRef}
        className={`glass-pro rounded-[3rem] p-10 relative transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-none overflow-hidden ${showMockup ? 'h-[450px]' : 'h-[360px]'}`}
        style={{ 
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        {/* Mockup Backgrounds */}
        <div className={`absolute inset-0 transition-opacity duration-700 ${showMockup ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute inset-0 bg-[#111] opacity-90"></div>
          {/* Fabric/Texture Pattern */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>
        </div>

        {/* Laser Glow */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at ${tilt.y * -15 + 50}% ${tilt.x * 15 + 50}%, #6366f1, transparent 45%)`
          }}
        />

        <div className="relative z-10 h-full flex flex-col justify-center">
          <div className="flex flex-col md:flex-row items-center gap-12">
            
            {/* Logo Container */}
            <div className={`relative transition-all duration-1000 ease-out transform-gpu ${isHovered ? 'scale-110 -translate-y-4' : 'scale-100'}`}>
              <div className={`w-44 h-44 rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 ${showMockup ? 'bg-transparent border-none' : 'bg-white p-6'}`}>
                <img 
                  src={logo.imageUrl} 
                  alt="Neural Logo" 
                  className={`w-full h-full object-contain mix-blend-multiply transition-all duration-500 ${showMockup ? 'filter invert contrast-125 brightness-150 scale-125' : ''}`}
                />
              </div>
              {/* Sérigraphie grain overlay (only visible on the image area) */}
              <div className="absolute inset-0 pointer-events-none opacity-40 print-texture mix-blend-overlay"></div>
            </div>

            {/* Content Reveal */}
            <div className="flex-1 text-center md:text-left">
              <div className={`transition-all duration-500 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-[1px] w-8 bg-indigo-500/50"></span>
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Proprietary Concept</span>
                </div>
                
                <h2 className={`text-6xl font-black text-white tracking-tighter ${logo.fontFamily} leading-none mb-4`}>
                  {isHovered ? renderAnimatedName(logo.businessName) : ''}
                </h2>
                
                <p className="text-slate-500 text-sm max-w-sm font-light italic">
                  {logo.description.substring(0, 100)}...
                </p>
              </div>

              {/* Action Buttons */}
              <div className={`mt-8 flex flex-wrap gap-4 transition-all duration-500 delay-150 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <button 
                  onClick={() => setShowMockup(!showMockup)}
                  className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all border ${showMockup ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-transparent border-white/10 text-slate-400 hover:bg-white/5'}`}
                >
                  {showMockup ? 'Studio View' : 'Project on Fabric'}
                </button>
                <button 
                  onClick={() => onDownload(logo)}
                  className="bg-white text-black px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-400 hover:text-white transition-all shadow-xl"
                >
                  Export Kit
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Custom Cursor (on card) */}
        {isHovered && !showMockup && (
          <div 
            className="fixed pointer-events-none z-50 w-8 h-8 rounded-full border border-indigo-500 flex items-center justify-center mix-blend-difference"
            style={{ 
              left: `${tilt.y * -5 + 50}%`, 
              top: `${tilt.x * 5 + 50}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="w-1 h-1 bg-indigo-500 rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogoCard;
