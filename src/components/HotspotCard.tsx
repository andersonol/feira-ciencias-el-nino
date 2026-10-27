import React from 'react';
import { X, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { HotspotPoint } from '../types/elnino';

interface HotspotCardProps {
  hotspot: HotspotPoint;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  totalPoints: number;
}

export const HotspotCard: React.FC<HotspotCardProps> = ({
  hotspot,
  onClose,
  onPrev,
  onNext,
  totalPoints,
}) => {
  return (
    <div 
      className="w-full max-w-[340px] sm:max-w-[380px] bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-5 text-slate-800 transition-all animate-in fade-in zoom-in-95 duration-200 relative select-text"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Top Bar: Category & Close button */}
      <div className="flex items-center justify-between gap-2 mb-2 pb-1 border-b border-slate-100">
        <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
          <MapPin className="w-3 h-3 text-orange-500 shrink-0" />
          <span>{hotspot.category}</span>
        </div>

        <button
          onClick={onClose}
          aria-label="Fechar card"
          className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Title */}
      <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mb-2.5">
        {hotspot.title}
      </h3>

      {/* Text body */}
      <p className="text-xs sm:text-[13px] leading-relaxed text-slate-600 mb-4 max-h-[180px] overflow-y-auto pr-1">
        {hotspot.text}
      </p>

      {/* Footer matching mockup */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
        <span className="text-slate-500 font-medium text-[11px]">
          {hotspot.tag}
        </span>

        <div className="flex items-center gap-2">
          {/* Previous / Next buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={onPrev}
              title="Ponto anterior"
              aria-label="Ponto anterior"
              className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onNext}
              title="Próximo ponto"
              aria-label="Próximo ponto"
              className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-50 text-orange-700 border border-orange-200/70">
            Tópico {hotspot.topicNumber} de {totalPoints}
          </span>
        </div>
      </div>
    </div>
  );
};
