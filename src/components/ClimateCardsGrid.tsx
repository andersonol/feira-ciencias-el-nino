import React, { useState } from 'react';
import { ZoomIn, X } from 'lucide-react';
import { ClimateCard } from '../types/elnino';
import { CLIMATE_CARDS } from '../data/elninoData';

export const ClimateCardsGrid: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<ClimateCard | null>(null);

  // Fallback image handler
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, card: ClimateCard) => {
    // If loading from /assets/ fails, try /public/assets/
    const target = e.target as HTMLImageElement;
    if (!target.src.includes('/public/assets/')) {
      target.src = card.image.replace('/assets/', '/public/assets/');
    }
  };

  // Explicit CSS order mapping:
  // Mobile (1 col): A, B, C, D, E, F
  // Desktop (2 cols): Row 1 (A, D), Row 2 (B, E), Row 3 (C, F) -> sequence A, D, B, E, C, F
  const getOrderClass = (key: 'A' | 'B' | 'C' | 'D' | 'E' | 'F'): string => {
    switch (key) {
      case 'A':
        return 'order-1 md:order-1';
      case 'B':
        return 'order-2 md:order-3';
      case 'C':
        return 'order-3 md:order-5';
      case 'D':
        return 'order-4 md:order-2';
      case 'E':
        return 'order-5 md:order-4';
      case 'F':
        return 'order-6 md:order-6';
      default:
        return '';
    }
  };

  return (
    <section className="w-full mt-10">
      {/* 2 columns on desktop, 1 column on mobile, with responsive ordering */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start">
        {CLIMATE_CARDS.map((card) => {
          return (
            <div
              key={card.id}
              className={`group bg-white rounded-2xl border border-sky-100/90 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col ${getOrderClass(
                card.letterKey
              )}`}
            >
              {/* Image Container with letter tag */}
              <div className="relative w-full aspect-[16/9] bg-slate-100 overflow-hidden border-b border-sky-50">
                {/* Lowercase letter in top-left matching mockup: a), b), c), d), e), f) */}
                <div className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-xs font-mono font-bold text-slate-700 shadow-xs border border-slate-200/60">
                  {card.letter}
                </div>

                {/* Zoom button on hover */}
                <button
                  onClick={() => setSelectedImage(card)}
                  aria-label={`Ampliar imagem do tópico ${card.letter}`}
                  className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm"
                  title="Ver em tamanho ampliado"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>

                {/* Main image */}
                <img
                  src={card.image}
                  alt={`${card.uppercaseLetter} ${card.title}`}
                  onError={(e) => handleImageError(e, card)}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              {/* Text content area matching mockup */}
              <div className="p-5 sm:p-6 flex flex-col flex-grow">
                {/* Card Title with letter prefix matching mockup */}
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mb-2.5">
                  <span className="mr-1.5 font-bold text-slate-900">{card.uppercaseLetter}</span>
                  {card.title}
                </h3>

                {/* Card Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {card.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Image Zoom Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="w-full max-w-4xl bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 px-6 border-b border-white/10 flex items-center justify-between text-white bg-slate-950/80">
              <span className="font-bold text-sm sm:text-base">
                {selectedImage.title}
              </span>
              <button
                onClick={() => setSelectedImage(null)}
                aria-label="Fechar ampliação"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 flex-grow flex items-center justify-center bg-black/95 overflow-hidden">
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="max-w-full max-h-[65vh] object-contain rounded-lg"
              />
            </div>

            <div className="p-5 bg-slate-950 text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-white/10">
              <p>{selectedImage.text}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
