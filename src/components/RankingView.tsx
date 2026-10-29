import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Medal, 
  Clock, 
  Award, 
  ArrowLeft, 
  Lock, 
  ShieldAlert, 
  Timer, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { RankingEntry } from '../types/elnino';
import { 
  calculateFairStatus, 
  getStoredUser,
  syncFairOverrideFromServer
} from '../utils/fairTime';

interface RankingViewProps {
  ranking: RankingEntry[];
  onStartQuiz: () => void;
  onBackToMap: () => void;
  onOpenAdmin?: () => void;
}

export const RankingView: React.FC<RankingViewProps> = ({
  ranking,
  onStartQuiz,
  onBackToMap,
}) => {
  const [fairStatus, setFairStatus] = useState(calculateFairStatus());
  const currentUser = getStoredUser();

  useEffect(() => {
    syncFairOverrideFromServer().then(() => {
      setFairStatus(calculateFairStatus());
    });
    const timer = setInterval(() => {
      setFairStatus(calculateFairStatus());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sort participants: score DESC, then timeSeconds ASC
  const sortedRanking = [...ranking].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.timeSeconds - b.timeSeconds;
  });

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const top3 = sortedRanking.slice(0, 3);

  // CASE 1: Before Fair Start (< 08:30)
  if (fairStatus.status === 'before') {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center animate-in fade-in">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-xl space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8 text-slate-600" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#f95716] mb-2 block">
              Observatório El Niño • Feira de Ciências
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              A feira de ciências ainda não foi iniciada
            </h2>
            <p className="text-sm text-slate-600 mt-3 max-w-md mx-auto leading-relaxed">
              O quadro de classificação e as participações serão liberados pontualmente às <strong>08:30 da manhã</strong> do dia 30/10/2026.
            </p>
          </div>

          {/* Countdown indicator */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl max-w-sm mx-auto">
            <span className="text-xs uppercase font-bold text-slate-500 block mb-1">
              Tempo restante para o início
            </span>
            <span className="font-mono text-2xl font-black text-slate-800">
              {fairStatus.formattedTimeRemaining}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onBackToMap}
              className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              Voltar ao Mapa Interativo
            </button>
          </div>
        </div>
      </div>
    );
  }

  // CASE 2: After Fair Finalization (> 11:30) -> Show ONLY the TOP 3 PODIUM
  if (fairStatus.status === 'after') {
    return (
      <div className="max-w-3xl mx-auto py-8 sm:py-12 px-4 animate-in fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Feira de Ciências Finalizada • Resultado Oficial</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Pódio dos Campeões
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto">
            A feira foi encerrada às 11:30. Parabéns a todos os participantes! Abaixo estão os três melhores colocados do desafio.
          </p>
        </div>

        {/* Podium for Top 3 */}
        {top3.length > 0 ? (
          <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-xl mx-auto items-end mb-10 pt-4">
            {/* 2nd Place */}
            {top3[1] && (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-200 border-2 border-slate-300 flex items-center justify-center text-slate-700 shadow-md mb-2">
                  <Medal className="w-6 h-6 text-slate-500" />
                </div>
                
                {/* Arrow highlight if currentUser */}
                {currentUser && top3[1].name.trim().toLowerCase() === currentUser.trim().toLowerCase() && (
                  <div className="flex items-center gap-1 text-[11px] font-black text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full mb-1 animate-bounce">
                    <span>👉 Você</span>
                  </div>
                )}

                <span className="text-xs sm:text-sm font-bold text-slate-800 text-center truncate max-w-[100px]">
                  {top3[1].name}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {top3[1].score}/9 pts ({formatTime(top3[1].timeSeconds)})
                </span>
                <div className="w-full bg-slate-200/95 rounded-t-2xl h-28 sm:h-32 mt-2 flex flex-col items-center justify-center font-black text-slate-500 text-2xl border-t border-slate-300 shadow-sm">
                  <span>2º</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Prata</span>
                </div>
              </div>
            )}

            {/* 1st Place */}
            {top3[0] && (
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-100 border-2 border-amber-400 flex items-center justify-center text-amber-600 shadow-xl mb-2 ring-4 ring-amber-300/40">
                  <Trophy className="w-7 h-7 sm:w-8 sm:h-8 text-amber-500" />
                </div>

                {/* Arrow highlight if currentUser */}
                {currentUser && top3[0].name.trim().toLowerCase() === currentUser.trim().toLowerCase() && (
                  <div className="flex items-center gap-1 text-[11px] font-black text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full mb-1 animate-bounce">
                    <span>👉 Você</span>
                  </div>
                )}

                <span className="text-xs sm:text-base font-extrabold text-slate-900 text-center truncate max-w-[120px]">
                  {top3[0].name}
                </span>
                <span className="text-xs font-bold text-amber-700 font-mono">
                  {top3[0].score}/9 pts ({formatTime(top3[0].timeSeconds)})
                </span>
                <div className="w-full bg-gradient-to-t from-amber-400 to-amber-300 rounded-t-2xl h-36 sm:h-44 mt-2 flex flex-col items-center justify-center font-black text-amber-900 text-3xl shadow-md border-t border-amber-200">
                  <span>1º</span>
                  <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-widest">Ouro</span>
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {top3[2] && (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-amber-800/10 border-2 border-amber-700/30 flex items-center justify-center text-amber-800 shadow-md mb-2">
                  <Award className="w-6 h-6 text-amber-700" />
                </div>

                {/* Arrow highlight if currentUser */}
                {currentUser && top3[2].name.trim().toLowerCase() === currentUser.trim().toLowerCase() && (
                  <div className="flex items-center gap-1 text-[11px] font-black text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full mb-1 animate-bounce">
                    <span>👉 Você</span>
                  </div>
                )}

                <span className="text-xs sm:text-sm font-bold text-slate-800 text-center truncate max-w-[100px]">
                  {top3[2].name}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {top3[2].score}/9 pts ({formatTime(top3[2].timeSeconds)})
                </span>
                <div className="w-full bg-amber-100/90 rounded-t-2xl h-22 sm:h-26 mt-2 flex flex-col items-center justify-center font-black text-amber-800/50 text-xl border-t border-amber-200 shadow-xs">
                  <span>3º</span>
                  <span className="text-[10px] font-bold text-amber-800/70 uppercase tracking-widest">Bronze</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-8 bg-white rounded-3xl border border-slate-200 text-slate-500">
            Nenhum participante registrado.
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3 pt-6 border-t border-slate-200">
          <button
            onClick={onBackToMap}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs sm:text-sm hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Mapa</span>
          </button>
        </div>
      </div>
    );
  }

  // CASE 3: During Fair Time (08:30 - 11:30) -> Show Full List with Countdown above
  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4 animate-in fade-in">
      {/* Countdown Banner above list */}
      <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-orange-50 border border-orange-200 text-orange-900 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-orange-100 border border-orange-200/70 flex items-center justify-center shrink-0">
            <Timer className="w-5 h-5 text-orange-700" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-orange-700 block font-normal">
              Feira de Ciências em Andamento
            </span>
            <h3 className="text-sm sm:text-base text-orange-950 font-normal">
              Tempo Restante para Finalização da Feira
            </h3>
          </div>
        </div>

        <div className="bg-orange-100/70 px-4 py-2 rounded-xl border border-orange-200/80 font-mono text-lg sm:text-xl text-orange-900 text-center font-normal tracking-wide">
          {fairStatus.formattedTimeRemaining}
        </div>
      </div>

      {/* Title */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Classificação Oficial do Quiz
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Critério de ordenação: maior número de acertos (de 9); em caso de empate, menor tempo de resposta.
        </p>
      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Participantes ({sortedRanking.length})
          </span>
          {currentUser && (
            <span className="text-xs font-bold text-orange-600 flex items-center gap-1">
              <span>👉 Seu participante:</span>
              <span className="underline">{currentUser}</span>
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-4 sm:px-6">Posição</th>
                <th className="py-3 px-4 sm:px-6">Nome do Participante</th>
                <th className="py-3 px-4 sm:px-6 text-center">Acertos</th>
                <th className="py-3 px-4 sm:px-6 text-right">Tempo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedRanking.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 px-4 text-center text-slate-400">
                    <p className="font-semibold text-slate-700 text-sm">Nenhum participante registrado ainda.</p>
                    <p className="text-xs text-slate-400 mt-1">Seja o primeiro a completar o Quiz e conquistar o topo do ranking!</p>
                  </td>
                </tr>
              ) : (
                sortedRanking.map((entry, index) => {
                  const isUser = currentUser && entry.name.trim().toLowerCase() === currentUser.trim().toLowerCase();

                  return (
                    <tr 
                      key={entry.id} 
                      className={`transition-colors ${
                        isUser 
                          ? 'bg-orange-50/90 font-bold text-orange-950 ring-2 ring-orange-400/50 relative z-10' 
                          : index < 3
                          ? 'bg-amber-50/20 font-semibold text-slate-800'
                          : 'text-slate-700 hover:bg-slate-50/80'
                      }`}
                    >
                      {/* Position */}
                      <td className="py-3.5 px-4 sm:px-6 font-mono">
                        {index === 0 ? '🥇 1º' : index === 1 ? '🥈 2º' : index === 2 ? '🥉 3º' : `${index + 1}º`}
                      </td>

                      {/* Name + Arrow indicator if current user */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-2">
                          {isUser && (
                            <span className="inline-flex items-center gap-1 bg-orange-600 text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
                              <span>👉 Você</span>
                            </span>
                          )}
                          <span className={`text-sm ${isUser ? 'font-black text-orange-900' : 'font-bold text-slate-900'}`}>
                            {entry.name}
                          </span>
                        </div>
                      </td>

                      {/* Score */}
                      <td className="py-3.5 px-4 sm:px-6 text-center font-bold text-orange-600 font-mono">
                        {entry.score} / {entry.totalQuestions}
                      </td>

                      {/* Time */}
                      <td className="py-3.5 px-4 sm:px-6 text-right text-slate-500 font-mono">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {formatTime(entry.timeSeconds)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={onBackToMap}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Mapa</span>
        </button>
        <button
          onClick={onStartQuiz}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#f95716] hover:bg-[#ea4e0f] text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer hover:scale-102"
        >
          <span>Ir para o Quiz</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
