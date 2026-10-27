import React from 'react';
import { Home, HelpCircle, Trophy, Users } from 'lucide-react';
import { NavTab } from './Navbar';
import { soundService } from '../utils/sound';

interface MobileBottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const navItems: {
    id: NavTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'efeito', label: 'Início', icon: Home },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle },
    { id: 'ranking', label: 'Ranking', icon: Trophy },
    { id: 'sobre', label: 'Sobre nós', icon: Users },
  ];

  const handleTabClick = (tabId: NavTab) => {
    soundService.playPop();
    onSelectTab(tabId);
  };

  return (
    <nav
      aria-label="Navegação inferior mobile"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="grid grid-cols-4 items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-1 transition-all duration-150 cursor-pointer select-none active:scale-95 ${
                isActive ? 'text-[#c22d1d]' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative mb-0.5 flex items-center justify-center">
                <Icon
                  className={`w-5 h-5 transition-transform duration-150 ${
                    isActive ? 'scale-110 fill-[#c22d1d]' : 'scale-100'
                  }`}
                />
              </div>
              <span
                className={`text-[11px] leading-tight tracking-tight ${
                  isActive ? 'font-extrabold text-[#c22d1d]' : 'font-medium text-slate-600'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
