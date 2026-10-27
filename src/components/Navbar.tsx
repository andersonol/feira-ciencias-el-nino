import React, { useState } from 'react';
import { Volume2, VolumeX, Menu, X, ChevronRight } from 'lucide-react';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const tabs: { id: NavTab; label: string }[] = [
    { id: 'efeito', label: 'O Efeito El Niño' },
    { id: 'quiz', label: 'Quiz' },
    { id: 'ranking', label: 'Ranking' },
    { id: 'sobre', label: 'Sobre nós' },
  ];

  const handleTabClick = (tabId: NavTab) => {
    onSelectTab(tabId);
    setMobileMenuOpen(false);
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

        {/* Mobile Right Controls: Sound Toggle & Hamburger Button */}
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

          {/* Hamburger Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
            className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-slate-800" />
            ) : (
              <Menu className="w-5 h-5 text-slate-800" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/98 backdrop-blur-lg px-4 py-4 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-2">
            {tabs.map((tab) => {
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#f95716] text-white shadow-sm'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-100'
                  }`}
                >
                  <span>{tab.label}</span>
                  <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};
