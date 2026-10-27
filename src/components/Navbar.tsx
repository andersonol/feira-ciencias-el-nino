import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export type NavTab = 'efeito' | 'quiz' | 'ranking' | 'sobre';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  soundEnabled,
  onToggleSound,
}) => {
  const tabs: { id: NavTab; label: string }[] = [
    { id: 'efeito', label: 'O Efeito El Niño' },
    { id: 'quiz', label: 'Quiz' },
    { id: 'ranking', label: 'Ranking' },
    { id: 'sobre', label: 'Sobre nós' },
  ];

  const handleTabClick = (tabId: NavTab) => {
    onSelectTab(tabId);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
        {/* Brand Zone with CEPRA College Logo replacing "EN" */}
        <div 
          onClick={() => handleTabClick('efeito')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          {/* Circular logo container with CEPRA college image */}
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white border border-slate-200/90 shadow-sm group-hover:scale-105 transition-transform flex items-center justify-center p-0.5 shrink-0">
            <img
              src="/assets/aistudio/logo-colegio_85d2bfac.jpeg"
              alt="Logo Colégio CEPRA"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.src.includes('/public/assets/')) {
                  target.src = '/public/assets/aistudio/logo-colegio_85d2bfac.jpeg';
                }
              }}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <span className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 group-hover:text-orange-600 transition-colors uppercase">
            El Niño-Mapa
          </span>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-2 sm:gap-2.5">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-150 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#f95716] text-white shadow-sm hover:bg-[#ea4e0f]'
                    : 'bg-white text-slate-700 border border-slate-200/90 hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}

          {/* Sound Toggle (Desktop) */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Silenciar efeitos sonoros' : 'Ativar efeitos sonoros'}
            aria-label="Toggle som"
            className="flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors ml-1 cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>
        </nav>

        {/* Mobile Right Controls: Sound Toggle */}
        <div className="flex md:hidden items-center gap-2">
          {/* Sound toggle button on mobile */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Silenciar efeitos' : 'Ativar efeitos'}
            aria-label="Toggle som"
            className="w-9 h-9 rounded-full border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 flex items-center justify-center transition-colors cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-orange-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
