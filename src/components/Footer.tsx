import React from 'react';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  return (
    <footer className="w-full mt-16 sm:mt-24 border-t border-slate-200/80 bg-white/60 py-8 px-4 sm:px-6 mb-16 md:mb-0">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          <p className="font-semibold text-slate-700">
            El Niño · Observatório Climático
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Dados educativos sobre o fenômeno El Niño-Oscilação Sul (ENOS).
          </p>
        </div>

        <div className="text-[11px] text-slate-400 sm:text-right flex flex-col items-start sm:items-end gap-1">
          <p>Mapa ilustrativo com intuito educativo — pode apresentar discrepâncias</p>
          <div className="flex items-center gap-2">
            <span>Projeto de Apresentação • Feira de Ciências 2026</span>
            {onOpenAdmin && (
              <>
                <span>·</span>
                <button
                  onClick={onOpenAdmin}
                  title="Abrir simulador secreto de horário e regras para testes"
                  className="text-slate-400 hover:text-amber-600 transition-colors cursor-pointer font-medium"
                >
                  ⚙️ Painel de Testes
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
