
import React, { useState } from 'react';
import GeneratorForm from './components/GeneratorForm';
import LogoCard from './components/LogoCard';
import CodeModal from './components/CodeModal';
import { LogoConfig, GeneratedLogo } from './types';
import { generateLogoProposals } from './services/geminiService';

const App: React.FC = () => {
  const [logos, setLogos] = useState<GeneratedLogo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLogoForCode, setSelectedLogoForCode] = useState<GeneratedLogo | null>(null);

  const handleGenerate = async (config: LogoConfig) => {
    setIsLoading(true);
    setError(null);
    try {
      const proposals = await generateLogoProposals(config, 4);
      setLogos(prev => [...proposals, ...prev]);
    } catch (err) {
      setError('Neural feedback loop interrupted. Retrying sync...');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (logo: GeneratedLogo) => {
    const link = document.createElement('a');
    link.href = logo.imageUrl;
    link.download = `nova-pro-${logo.businessName.toLowerCase()}-${logo.id}.png`;
    link.click();
  };

  const handleInspect = (logo: GeneratedLogo) => {
    setSelectedLogoForCode(logo);
  };

  return (
    <div className="min-h-screen pb-32">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-950/10 to-transparent"></div>
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[200px]"></div>
      </div>

      <header className="border-b border-white/5 bg-slate-950/80 backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-10 py-5 flex justify-between items-center">
          <div className="flex items-center gap-5">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-[0_0_25px_rgba(255,255,255,0.15)] group cursor-pointer hover:rotate-90 transition-transform duration-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            </div>
            <div>
              <h1 className="text-2xl font-black font-display tracking-tighter leading-none uppercase">LogoNova <span className="text-indigo-500 font-light italic">Neural OS</span></h1>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.5em] mt-1 block">Autonomous Brand Synthesis</span>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-full border border-white/5">
             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">GPU Clusters Online</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-10 mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
          <div className="lg:col-span-5 space-y-16">
            <div className="space-y-8">
              <div className="inline-block px-3 py-1 rounded-md bg-white/5 border border-white/10 text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em]">
                Synthesis Engine v4.0 Alpha
              </div>
              <h2 className="text-8xl font-black leading-[0.85] font-display tracking-tighter text-white uppercase">
                Zero <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-600">Friction.</span>
              </h2>
              <p className="text-xl text-slate-500 leading-relaxed font-light max-w-sm">
                Generated as isolated neural assets on pure black. Instant <span className="text-white font-medium italic">Alpha Blending</span> for any UI. No background removal needed.
              </p>
            </div>

            <GeneratorForm onGenerate={handleGenerate} isLoading={isLoading} />
            
            {error && (
              <div className="p-8 glass-pro border-red-500/30 text-red-400 rounded-[2rem] text-xs font-black uppercase tracking-widest flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">!</div>
                {error}
              </div>
            )}
          </div>

          <div className="lg:col-span-7 space-y-16">
            <div className="flex items-center justify-between border-b border-white/5 pb-8">
              <h3 className="text-xl font-black font-display text-white tracking-widest uppercase">Autonomous Feed</h3>
            </div>

            <div className="space-y-12">
              {isLoading && (
                <div className="space-y-12 animate-pulse">
                  {[1, 2].map(i => (
                    <div key={i} className="glass-pro rounded-[3.5rem] p-12 h-[500px] flex items-center gap-12 relative overflow-hidden">
                       <div className="scan-line absolute inset-x-0 top-0"></div>
                       <div className="w-56 h-56 bg-slate-900 rounded-full"></div>
                       <div className="space-y-6 flex-1">
                         <div className="h-16 bg-slate-900 rounded-2xl w-full"></div>
                         <div className="h-4 bg-slate-900 rounded-xl w-2/3"></div>
                         <div className="h-10 bg-slate-900 rounded-xl w-1/3"></div>
                       </div>
                    </div>
                  ))}
                </div>
              )}
              
              {logos.length === 0 && !isLoading ? (
                <div className="h-[700px] border border-white/5 glass-pro rounded-[4rem] flex flex-col items-center justify-center text-slate-800 space-y-10 group transition-all">
                  <div className="text-center space-y-4">
                    <p className="text-4xl font-black font-display uppercase tracking-[0.3em] opacity-10">Neural Null State</p>
                    <p className="text-slate-700 font-black text-[10px] uppercase tracking-[0.5em]">Input Brand Vector To Begin</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-12">
                  {logos.map((logo, index) => (
                    <LogoCard 
                      key={logo.id} 
                      logo={logo} 
                      onDownload={handleDownload}
                      onInspect={handleInspect}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {selectedLogoForCode && (
        <CodeModal logo={selectedLogoForCode} onClose={() => setSelectedLogoForCode(null)} />
      )}
    </div>
  );
};

export default App;
