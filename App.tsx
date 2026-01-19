
import React, { useState } from 'react';
import GeneratorForm from './components/GeneratorForm';
import LogoCard from './components/LogoCard';
import { LogoConfig, GeneratedLogo } from './types';
import { generateLogoProposals } from './services/geminiService';

const App: React.FC = () => {
  const [logos, setLogos] = useState<GeneratedLogo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (config: LogoConfig) => {
    setIsLoading(true);
    setError(null);
    try {
      const imageUrls = await generateLogoProposals(config, 4);
      const newLogos: GeneratedLogo[] = imageUrls.map(url => ({
        id: Math.random().toString(36).substr(2, 9),
        imageUrl: url,
        businessName: config.businessName,
        description: config.niche,
        createdAt: Date.now(),
        fontFamily: config.fontFamily
      }));
      setLogos(prev => [...newLogos, ...prev]);
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

  return (
    <div className="min-h-screen pb-32">
      {/* Background Ambience */}
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
              <h1 className="text-2xl font-black font-display tracking-tighter leading-none">LogoNova <span className="text-indigo-500 font-light">PRO</span></h1>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.5em] mt-1 block">Advanced Identity Synthesis</span>
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center gap-10">
            {['Neural Models', 'Studio Feed', 'Export Logs'].map(item => (
              <a key={item} href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">{item}</a>
            ))}
          </nav>

          <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-full border border-white/5">
             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">Live Studio Node</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-10 mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
          
          {/* Controls Panel */}
          <div className="lg:col-span-5 space-y-16">
            <div className="space-y-8">
              <div className="inline-block px-3 py-1 rounded-md bg-white/5 border border-white/10 text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em]">
                Synthesis Engine v3.14
              </div>
              <h2 className="text-8xl font-black leading-[0.85] font-display tracking-tighter text-white">
                Architect <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-500">Silence.</span>
              </h2>
              <p className="text-xl text-slate-500 leading-relaxed font-light max-w-sm">
                From high-gloss 3D extrusion to tactile <span className="text-white font-medium">Sérigraphie</span> ink bleeds. Define your essence, let our neural node render your legacy.
              </p>
            </div>

            <GeneratorForm onGenerate={handleGenerate} isLoading={isLoading} />
            
            {error && (
              <div className="p-8 glass-pro border-red-500/30 text-red-400 rounded-[2rem] text-xs font-black uppercase tracking-widest flex items-center gap-4 animate-in fade-in slide-in-from-left-4">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">!</div>
                {error}
              </div>
            )}
          </div>

          {/* Synthesis Feed */}
          <div className="lg:col-span-7 space-y-16">
            <div className="flex items-center justify-between border-b border-white/5 pb-8">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-black font-display text-white tracking-widest uppercase">Live Synthesis</h3>
                <span className="bg-indigo-600/10 text-indigo-400 text-[10px] font-black px-3 py-1 rounded-full uppercase">
                  {logos.length} iterations
                </span>
              </div>
            </div>

            <div className="space-y-12">
              {isLoading && (
                <div className="space-y-12 animate-pulse">
                  {[1, 2].map(i => (
                    <div key={i} className="glass-pro rounded-[3rem] p-12 h-[360px] flex items-center gap-12 relative overflow-hidden">
                       <div className="scan-line absolute inset-x-0 top-0"></div>
                       <div className="w-44 h-44 bg-slate-900 rounded-3xl"></div>
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
                <div className="h-[650px] border border-white/5 glass-pro rounded-[4rem] flex flex-col items-center justify-center text-slate-800 space-y-10 group transition-all hover:border-indigo-500/20">
                  <div className="relative">
                    <div className="w-40 h-40 bg-slate-900/50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                      <svg className="w-20 h-20 opacity-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
                    </div>
                    <div className="absolute inset-0 bg-indigo-500/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  </div>
                  <div className="text-center space-y-4">
                    <p className="text-3xl font-black font-display uppercase tracking-[0.2em] opacity-10">Neural Node Idle</p>
                    <p className="text-slate-700 font-black text-[10px] uppercase tracking-widest">Awaiting Identity Vector Input</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-12">
                  {logos.map((logo, index) => (
                    <LogoCard 
                      key={logo.id} 
                      logo={logo} 
                      onDownload={handleDownload}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      {/* Cinematic Studio Footer */}
      <footer className="mt-40 pt-20 pb-10 border-t border-white/5 bg-black/50">
        <div className="max-w-7xl mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-center md:text-left">
            <h4 className="text-white font-black font-display tracking-widest text-lg">LOGONOVA LABS</h4>
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] mt-2">© 2024 NEURAL DESIGN SYSTEMS</p>
          </div>
          <div className="flex gap-12">
            {['Privacy Protocol', 'Studio Terms', 'Contact Node'].map(item => (
              <a key={item} href="#" className="text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-indigo-400 transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
