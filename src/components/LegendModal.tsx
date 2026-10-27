import React from 'react';
import { X, Thermometer, Wind, CheckCircle2, ChevronRight, Info } from 'lucide-react';
import { HOTSPOT_POINTS } from '../data/elninoData';

interface LegendModalProps {
  isOpen: boolean;
  onClose: () => void;
  visitedPoints: Set<number>;
  onSelectPoint: (id: number) => void;
}

export const LegendModal: React.FC<LegendModalProps> = ({
  isOpen,
  onClose,
  visitedPoints,
  onSelectPoint,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Legenda do Mapa & Guia da Apresentação</h3>
              <p className="text-xs text-slate-500">Compreenda os dados oceanográficos e meteorológicos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar legenda"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Section 1: Escala Térmica */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <Thermometer className="w-4 h-4 text-orange-500" />
              <span>Escala de Temperatura da Superfície do Mar (SST / TSM)</span>
            </div>
            
            {/* Color Gradient Bar */}
            <div className="relative pt-1">
              <div className="h-5 w-full rounded-lg shadow-inner flex overflow-hidden border border-slate-200">
                <div className="w-[18%] bg-gradient-to-r from-blue-900 via-blue-700 to-cyan-500" />
                <div className="w-[15%] bg-gradient-to-r from-cyan-400 to-sky-200" />
                <div className="w-[12%] bg-slate-100" />
                <div className="w-[15%] bg-gradient-to-r from-amber-200 to-amber-400" />
                <div className="w-[20%] bg-gradient-to-r from-orange-400 to-red-500" />
                <div className="w-[20%] bg-gradient-to-r from-red-600 to-rose-950" />
              </div>
              <div className="flex justify-between text-[11px] font-mono font-semibold text-slate-600 mt-1.5 px-0.5">
                <span>-12.0°C</span>
                <span>-2.0°C</span>
                <span>-1.5°C</span>
                <span>0.0°C (Normal)</span>
                <span>+2.5°C</span>
                <span>+3.0°C</span>
                <span>+4.5°C (Super El Niño)</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed pt-1">
              • <strong className="text-slate-800">Mancha avermelhada/escura no centro do Pacífico:</strong> indica águas anômala e perigosamente mais quentes que a média climatológica, liberando vapor de água maciço na atmosfera.<br />
              • <strong className="text-slate-800">Tons azuis:</strong> representam águas mais frias ou de ressurgência profunda, ricas em nutrientes biológicos.
            </p>
          </div>

          {/* Section 2: Vetores de Vento */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <Wind className="w-4 h-4 text-sky-500" />
              <span>Setas Brancas (Vetores de Vento & Correntes)</span>
            </div>
            <div className="p-3.5 bg-sky-50/70 border border-sky-100 rounded-2xl text-xs text-slate-700 space-y-1.5">
              <p>
                <strong>Ventos Alísios:</strong> Sopram de leste para oeste na linha do Equador. Quando eles perdem força, a água aquecida volta para o leste.
              </p>
              <p>
                <strong>Corrente de Jato Subtropical:</strong> Vento em altos níveis que sopra sobre a América do Sul e bloqueia as frentes frias no Sul do Brasil, concentrando tempestades extremas.
              </p>
            </div>
          </div>

          {/* Section 3: Índice dos 9 Tópicos */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Os 9 Pontos Interativos ({visitedPoints.size}/9 explorados)
              </span>
              <span className="text-xs font-bold text-orange-600">
                {Math.round((visitedPoints.size / 9) * 100)}% concluído
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {HOTSPOT_POINTS.map((pt) => {
                const isVisited = visitedPoints.has(pt.id);
                return (
                  <button
                    key={pt.id}
                    onClick={() => {
                      onSelectPoint(pt.id);
                      onClose();
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      isVisited
                        ? 'bg-emerald-50/70 border-emerald-200/80 hover:bg-emerald-100/60'
                        : 'bg-white border-slate-200 hover:border-orange-300 hover:bg-orange-50/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      {isVisited ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-slate-300 text-[10px] font-bold text-slate-500 flex items-center justify-center shrink-0">
                          {pt.topicNumber}
                        </span>
                      )}
                      <span className="text-xs font-semibold text-slate-800 truncate">
                        {pt.title}
                      </span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Feira de Ciências • Climatologia e Oceanografia</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
