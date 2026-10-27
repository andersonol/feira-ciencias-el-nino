import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  MousePointer2, 
  Eye, 
  EyeOff, 
  Sparkles,
  Maximize2
} from 'lucide-react';
import { HotspotPoint } from '../types/elnino';
import { HOTSPOT_POINTS, VIDEO_PATH } from '../data/elninoData';
import { HotspotCard } from './HotspotCard';
import { LegendModal } from './LegendModal';
import { soundService } from '../utils/sound';

interface InteractiveVideoMapProps {
  onPointVisited: (id: number) => void;
  visitedPoints: Set<number>;
}

export const InteractiveVideoMap: React.FC<InteractiveVideoMapProps> = ({
  onPointVisited,
  visitedPoints,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activePointId, setActivePointId] = useState<number | null>(1); // Point 1 ("O fenômeno — ENOS") open initially!
  const [showLegend, setShowLegend] = useState<boolean>(false);
  const [showHotspots, setShowHotspots] = useState<boolean>(true);
  const [hoveredPointId, setHoveredPointId] = useState<number | null>(null);

  const activeHotspot = HOTSPOT_POINTS.find((pt) => pt.id === activePointId) || null;

  useEffect(() => {
    // Attempt auto-play with sound muted
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleRestart = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
  };

  const handleSelectPoint = (id: number) => {
    setActivePointId(id);
    onPointVisited(id);
    soundService.playPop();
  };

  const handlePrev = () => {
    if (!activePointId) return;
    const currentIndex = HOTSPOT_POINTS.findIndex((p) => p.id === activePointId);
    const prevIndex = (currentIndex - 1 + HOTSPOT_POINTS.length) % HOTSPOT_POINTS.length;
    handleSelectPoint(HOTSPOT_POINTS[prevIndex].id);
  };

  const handleNext = () => {
    if (!activePointId) return;
    const currentIndex = HOTSPOT_POINTS.findIndex((p) => p.id === activePointId);
    const nextIndex = (currentIndex + 1) % HOTSPOT_POINTS.length;
    handleSelectPoint(HOTSPOT_POINTS[nextIndex].id);
  };

  // Calculate card position relative to video container
  const getCardPositionStyle = (pt: HotspotPoint): React.CSSProperties => {
    // If screen is narrow (mobile), center it
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return {
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        position: 'absolute',
        zIndex: 35,
      };
    }

    // On desktop, position near point with bounds checking
    const isRightSide = pt.x > 50;
    const isBottomSide = pt.y > 60;

    return {
      left: isRightSide ? `${Math.max(8, pt.x - 34)}%` : `${Math.min(62, pt.x + 3)}%`,
      top: isBottomSide ? `${Math.max(6, pt.y - 30)}%` : `${Math.min(65, pt.y - 5)}%`,
      position: 'absolute',
      zIndex: 35,
    };
  };

  return (
    <div className="w-full relative">
      {/* Video Outer Frame with persistent generous map area */}
      <div 
        ref={containerRef}
        className="relative w-full h-[460px] sm:h-[500px] md:h-[560px] lg:h-[620px] rounded-3xl overflow-hidden bg-slate-950 border border-slate-200/90 shadow-2xl transition-all"
      >
        {/* Video Element: zoomed on mobile (scale-150 object-cover) to fully fill the map area */}
        <video
          ref={videoRef}
          src={VIDEO_PATH}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-150 sm:scale-100 origin-center block select-none pointer-events-none transition-transform duration-300"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Ambient Dark gradient on top/bottom edges for UI contrast */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/25 via-transparent to-black/20" />

        {/* Top-Left: LEGENDA button matching mockup */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20">
          <button
            onClick={() => {
              setShowLegend(true);
              soundService.playPop();
            }}
            className="group flex items-center gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-md hover:shadow-lg hover:border-orange-300 transition-all cursor-pointer text-left"
          >
            <div className="w-6 h-6 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <MousePointer2 className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black tracking-widest text-slate-800 uppercase leading-none">
                LEGENDA
              </span>
              <span className="text-[11px] font-medium text-slate-500 leading-tight">
                Clique para ver detalhes
              </span>
            </div>
          </button>
        </div>

        {/* Top-Right: Progress & Quick Actions */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex items-center gap-2">
          {/* Progress pill (9 topics) */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md text-white text-xs font-semibold border border-white/10 shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{visitedPoints.size}/9 Pontos vistos</span>
          </div>

          {/* Toggle Hotspots button */}
          <button
            onClick={() => setShowHotspots(!showHotspots)}
            title={showHotspots ? 'Ocultar marcadores' : 'Mostrar marcadores'}
            aria-label="Alternar pontos"
            className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-white flex items-center justify-center shadow-md transition-all cursor-pointer"
          >
            {showHotspots ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Video Play/Pause */}
          <button
            onClick={togglePlay}
            title={isPlaying ? 'Pausar vídeo' : 'Reproduzir vídeo'}
            aria-label="Play ou pause"
            className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-white flex items-center justify-center shadow-md transition-all cursor-pointer"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-slate-700 ml-0.5" />}
          </button>

          {/* Video Restart */}
          <button
            onClick={handleRestart}
            title="Reiniciar vídeo"
            aria-label="Reiniciar"
            className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-white flex items-center justify-center shadow-md transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 10 Interactive Hotspot Markers over Video */}
        {showHotspots && (
          <div className="absolute inset-0 pointer-events-auto">
            {HOTSPOT_POINTS.map((pt) => {
              const isSelected = activePointId === pt.id;
              const isVisited = visitedPoints.has(pt.id);
              const isHovered = hoveredPointId === pt.id;

              return (
                <div
                  key={pt.id}
                  style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                >
                  {/* Tooltip on Hover */}
                  {isHovered && !isSelected && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[11px] font-semibold tracking-wide whitespace-nowrap shadow-xl border border-white/10 pointer-events-none animate-in fade-in z-30">
                      Tópico {pt.topicNumber}: {pt.title}
                      <div className="w-2 h-2 bg-slate-900 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
                    </div>
                  )}

                  {/* Hotspot Pin button matching the pointer hand in the mockup */}
                  <button
                    onClick={() => handleSelectPoint(pt.id)}
                    onMouseEnter={() => setHoveredPointId(pt.id)}
                    onMouseLeave={() => setHoveredPointId(null)}
                    aria-label={`Ponto interativo ${pt.topicNumber}: ${pt.title}`}
                    className={`group relative flex items-center justify-center transition-transform duration-200 cursor-pointer ${
                      isSelected ? 'scale-125' : 'hover:scale-115'
                    }`}
                  >
                    {/* Pulsing ring indicator */}
                    <span 
                      className={`absolute w-8 h-8 rounded-full pointer-events-none transition-all ${
                        isSelected
                          ? 'bg-orange-500/40 animate-ping'
                          : isVisited
                          ? 'bg-emerald-400/30'
                          : 'bg-white/40 group-hover:scale-150 animate-pulse'
                      }`} 
                    />

                    {/* Hand cursor icon strictly resembling the mockup's pointer */}
                    <div 
                      className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shadow-lg transition-all ${
                        isSelected
                          ? 'bg-orange-600 text-white ring-4 ring-orange-400/40'
                          : isVisited
                          ? 'bg-white text-emerald-600 ring-2 ring-emerald-400'
                          : 'bg-white/95 text-slate-800 ring-2 ring-white/80 group-hover:bg-orange-500 group-hover:text-white'
                      }`}
                    >
                      <svg 
                        viewBox="0 0 24 24" 
                        fill="currentColor" 
                        className="w-4 h-4 sm:w-5 sm:h-5 filter drop-shadow-sm transition-transform -rotate-12 group-hover:rotate-0"
                      >
                        {/* Realistic Hand Pointing Finger Icon matching mockup */}
                        <path d="M10 2a2 2 0 0 0-2 2v6.59l-1.3-1.3a2 2 0 0 0-2.83 0 2 2 0 0 0 0 2.83l4.54 4.54c.6.6 1.41.94 2.26.94H16a4 4 0 0 0 4-4V8a2 2 0 0 0-2-2 2 2 0 0 0-1.8 1.12A2 2 0 0 0 14 6a2 2 0 0 0-2-1.72V4a2 2 0 0 0-2-2z" />
                      </svg>

                      {/* Small badge number */}
                      <span className={`absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center shadow-sm ${
                        isSelected 
                          ? 'bg-slate-900 text-white' 
                          : 'bg-orange-600 text-white'
                      }`}>
                        {pt.topicNumber}
                      </span>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Active Hotspot Card Floating in position matching mockup */}
        {activeHotspot && (
          <div 
            style={getCardPositionStyle(activeHotspot)}
            className="p-2 select-none"
          >
            <HotspotCard
              hotspot={activeHotspot}
              onClose={() => setActivePointId(null)}
              onPrev={handlePrev}
              onNext={handleNext}
              totalPoints={HOTSPOT_POINTS.length}
            />
          </div>
        )}

        {/* Mobile backdrop when card is open to avoid clipping */}
        {activeHotspot && (
          <div 
            className="md:hidden fixed inset-0 bg-black/50 z-30 flex items-center justify-center p-4 backdrop-blur-xs"
            onClick={() => setActivePointId(null)}
          >
            <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm">
              <HotspotCard
                hotspot={activeHotspot}
                onClose={() => setActivePointId(null)}
                onPrev={handlePrev}
                onNext={handleNext}
                totalPoints={HOTSPOT_POINTS.length}
              />
            </div>
          </div>
        )}
      </div>

      {/* Legend Modal */}
      <LegendModal
        isOpen={showLegend}
        onClose={() => setShowLegend(false)}
        visitedPoints={visitedPoints}
        onSelectPoint={handleSelectPoint}
      />
    </div>
  );
};
