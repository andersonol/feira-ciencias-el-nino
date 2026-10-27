import React from 'react';
import { BookOpen, ArrowLeft, Sparkles, GraduationCap } from 'lucide-react';

interface AboutViewProps {
  onBackToMap: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onBackToMap }) => {
  return (
    <div className="max-w-3xl mx-auto py-8 sm:py-12 px-4 animate-in fade-in duration-300">
      {/* Main Presentation Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl relative overflow-hidden">
        {/* Top Badges & College Logo */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm flex items-center justify-center p-1 shrink-0">
              <img
                src="/assets/aistudio/logo-colegio_85d2bfac.jpeg"
                alt="Colégio CEPRA"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.includes('/public/assets/')) {
                    target.src = '/public/assets/aistudio/logo-colegio_85d2bfac.jpeg';
                  }
                }}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#0f2d59]">
                  Colégio CEPRA
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-[11px] font-semibold text-slate-500">
                  2º Ano do Ensino Médio
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                Sobre nós
              </h2>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200/70 text-orange-700 text-xs font-bold self-start sm:self-center">
            <GraduationCap className="w-4 h-4 text-orange-600" />
            <span>Feira de Ciências 2026</span>
          </div>
        </div>

        {/* Content Prose */}
        <div className="py-6 sm:py-8 space-y-5 text-slate-700 text-sm sm:text-base leading-relaxed">
          <p className="text-lg sm:text-xl font-bold text-slate-900">
            Olá!
          </p>

          <p>
            Este site é parte do nosso projeto para a feira de ciências 2026 do colégio CEPRA que tem o efeito El Niño como tema principal. A ideia surge pelo fato de aparelhos celulares serem possuídos praticamente por todos independente da idade, tornando-os uma ótima ferramenta no meio da educação.
          </p>

          <p>
            O El Niño é um efeito que afeta a todos nós, e esse site que é fruto do trabalho do nosso grupo do 2° ano do ensino médio é nossa forma de ensinar o que sabemos sobre ele para você, contando com um mapa interativo, um quiz para testar seu conhecimento e um ranking premiado.
          </p>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 text-slate-900 font-bold leading-relaxed">
            Grupo composto por: Guilherme Malaquias, Heitor Rohen, Ícaro Brasil, Ísis Ribeiro, João Miguel, Rafael Eccard, Renan Santos e Renata Ornellas.
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onBackToMap}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer hover:scale-102"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Mapa Interativo</span>
          </button>

          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            Feira de Ciências CEPRA 2026
          </span>
        </div>
      </div>
    </div>
  );
};
