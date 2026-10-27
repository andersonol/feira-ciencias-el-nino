/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { InteractiveVideoMap } from './components/InteractiveVideoMap';
import { ClimateCardsGrid } from './components/ClimateCardsGrid';
import { Footer } from './components/Footer';
import { QuizView } from './components/QuizView';
import { RankingView } from './components/RankingView';
import { AboutView } from './components/AboutView';
import { MobileBottomNav } from './components/MobileBottomNav';
import { SecretAdminModal } from './components/SecretAdminModal';
import { soundService } from './utils/sound';
import { INITIAL_RANKING } from './data/elninoData';
import { RankingEntry } from './types/elnino';
import { calculateFairStatus } from './utils/fairTime';
import {
  fetchRankingFromDatabase,
  submitQuizToDatabase,
  resetDatabaseRanking
} from './services/rankingService';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('efeito');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [visitedPoints, setVisitedPoints] = useState<Set<number>>(new Set());
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const [ranking, setRanking] = useState<RankingEntry[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('elnino_ranking');
        if (saved) {
          const parsed = JSON.parse(saved) as RankingEntry[];
          const seedNames = ['beatriz almeida', 'lucas vasconcelos', 'mariana duarte', 'rafael guimarães', 'rafael guimaraes', 'camila siqueira'];
          return parsed.filter((r) => !seedNames.includes(r.name.trim().toLowerCase()) && !r.deviceFingerprint?.startsWith('seed_'));
        }
      } catch {
        // fallback
      }
    }
    return INITIAL_RANKING;
  });

  // Sync with SQLite database on mount and periodically keep devices updated
  useEffect(() => {
    let isMounted = true;
    const loadRanking = async () => {
      const data = await fetchRankingFromDatabase();
      if (isMounted) setRanking(data);
    };
    loadRanking();

    const interval = setInterval(loadRanking, 8000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Global keyboard shortcut to open secret admin panel: Ctrl+Shift+A or Cmd+Shift+A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setShowAdminModal((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundService.enabled = next;
  };

  const handlePointVisited = (id: number) => {
    setVisitedPoints((prev) => new Set([...prev, id]));
  };

  const handleSelectTab = (tab: NavTab) => {
    // If user clicks on quiz after the fair is finished, route directly to ranking
    if (tab === 'quiz') {
      const fairStatus = calculateFairStatus();
      if (fairStatus.status === 'after') {
        setCurrentTab('ranking');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        fetchRankingFromDatabase().then((data) => setRanking(data));
        return;
      }
    }

    if (tab === 'ranking') {
      fetchRankingFromDatabase().then((data) => setRanking(data));
    }

    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinishQuiz = async (name: string, score: number, timeSeconds: number, deviceFp: string) => {
    try {
      const res = await submitQuizToDatabase({
        name,
        score,
        timeSeconds,
        deviceFingerprint: deviceFp,
      });

      if (res.success && res.ranking) {
        setRanking(res.ranking);
      } else {
        // Fallback optimistic update
        const newEntry: RankingEntry = {
          id: Date.now().toString(),
          name,
          score,
          totalQuestions: 9,
          timeSeconds,
          date: new Date().toLocaleDateString('pt-BR'),
          deviceFingerprint: deviceFp,
        };
        setRanking((prev) => [newEntry, ...prev]);
      }
    } catch {
      // ignore
    }

    setCurrentTab('ranking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetRanking = async () => {
    const updated = await resetDatabaseRanking();
    setRanking(updated);
    setRefreshKey((k) => k + 1);
  };

  return (
    <div key={refreshKey} className="min-h-screen bg-[#fcfbf9] text-slate-800 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Top Navbar matching mockup */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Main Content Area with bottom clearance on mobile for the fixed footer navbar */}
      <main className="flex-grow max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10 pb-24 md:pb-10">
        {currentTab === 'efeito' && (
          <div className="space-y-8 sm:space-y-12">
            {/* Hero Section matching mockup typography and colors */}
            <section className="max-w-3xl pt-2 pb-2">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.08] mb-4">
                O planeta <br />
                <span className="text-[#dc6a32]">em</span>{' '}
                <span className="text-[#317d9c]">aquecimento</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl font-normal">
                Explore os pontos interativos no mapa e descubra como o El Niño — o
                aquecimento anômalo das águas do Pacífico — reescreve o clima de
                regiões distantes em todo o mundo.
              </p>
            </section>

            {/* Video Interactive Hotspot Map (zoomed on mobile, 9 topics) */}
            <section aria-label="Mapa interativo do El Niño em vídeo">
              <InteractiveVideoMap
                onPointVisited={handlePointVisited}
                visitedPoints={visitedPoints}
              />
            </section>

            {/* 6 Climate Cards Grid below video (2 per row on desktop A,D,B,E,C,F; 1 on mobile A,B,C,D,E,F) */}
            <section aria-label="Casos e Evidências Climáticas">
              <div className="border-t border-slate-200/80 pt-10 sm:pt-12">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#f95716]">
                      Casos & Padrões Oceanográficos
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                      Dinâmica Global e Impactos no Brasil
                    </h2>
                  </div>
                  <span className="text-xs text-slate-500">
                    6 registros comparativos
                  </span>
                </div>

                <ClimateCardsGrid />
              </div>
            </section>
          </div>
        )}

        {currentTab === 'quiz' && (
          <QuizView
            ranking={ranking}
            onFinishQuiz={handleFinishQuiz}
            onGoToRanking={() => setCurrentTab('ranking')}
            onBackToMap={() => setCurrentTab('efeito')}
          />
        )}

        {currentTab === 'ranking' && (
          <RankingView
            ranking={ranking}
            onStartQuiz={() => handleSelectTab('quiz')}
            onBackToMap={() => setCurrentTab('efeito')}
          />
        )}

        {currentTab === 'sobre' && (
          <AboutView onBackToMap={() => setCurrentTab('efeito')} />
        )}
      </main>

      {/* Footer with info */}
      <Footer />

      {/* Mobile Fixed Bottom Navigation Bar ("Início", "Quiz", "Ranking", "Sobre nós") */}
      <MobileBottomNav
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
      />

      {/* Secret Admin Modal for Science Fair schedule & testing */}
      <SecretAdminModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        onStateChanged={() => setRefreshKey((k) => k + 1)}
        onResetRanking={handleResetRanking}
      />
    </div>
  );
}
