import React, { useState, useEffect, useMemo } from 'react';
import { 
  Trophy, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  Award, 
  Lock, 
  Sparkles, 
  ShieldAlert,
  UserCheck
} from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/elninoData';
import { soundService } from '../utils/sound';
import { 
  calculateFairStatus, 
  getDeviceFingerprint, 
  setStoredUser,
  getStoredUser,
  syncFairOverrideFromServer
} from '../utils/fairTime';
import { RankingEntry } from '../types/elnino';
import { checkUserAvailability } from '../services/rankingService';

interface ShuffledQuestion {
  id: number;
  question: string;
  options: { text: string; isCorrect: boolean; originalIndex: number }[];
  explanation: string;
}

interface QuizViewProps {
  ranking: RankingEntry[];
  onFinishQuiz: (name: string, score: number, timeSeconds: number, deviceFp: string) => void;
  onGoToRanking: (reason?: string) => void;
  onBackToMap: () => void;
  onOpenAdmin?: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  ranking,
  onFinishQuiz,
  onGoToRanking,
  onBackToMap,
}) => {
  // Fair Schedule Status
  const [fairStatus, setFairStatus] = useState(calculateFairStatus());

  useEffect(() => {
    syncFairOverrideFromServer().then(() => {
      setFairStatus(calculateFairStatus());
    });
    const timer = setInterval(() => {
      setFairStatus(calculateFairStatus());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Check if fair has already ended -> redirect to ranking with reason
  useEffect(() => {
    if (fairStatus.status === 'after') {
      onGoToRanking('O quiz foi encerrado! Redirecionando para o ranking.');
    }
  }, [fairStatus.status, onGoToRanking]);

  // Device Fingerprint check
  const currentDeviceFp = useMemo(() => getDeviceFingerprint(), []);
  const deviceAlreadyParticipated = useMemo(() => {
    const inRanking = ranking.some((entry) => entry.deviceFingerprint === currentDeviceFp);
    if (inRanking) return true;
    if (typeof window !== 'undefined') {
      try {
        if (localStorage.getItem('elnino_quiz_has_completed') === 'true') {
          return true;
        }
      } catch {}
    }
    return false;
  }, [ranking, currentDeviceFp]);

  // Quiz Setup state
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  const [nameError, setNameError] = useState<string | null>(null);

  // Active Quiz State
  const [shuffledQuestions, setShuffledQuestions] = useState<ShuffledQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Timer while quiz is active
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (hasStarted && !isComplete) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [hasStarted, isComplete]);

  // Function to initialize shuffled questions and options
  const startQuizSession = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = userName.trim();

    if (!cleanName) {
      setNameError('Por favor, digite seu nome para iniciar.');
      return;
    }

    if (cleanName.length < 3) {
      setNameError('O nome deve conter pelo menos 3 caracteres.');
      return;
    }

    // Check unique username in local memory first
    const nameExistsLocally = ranking.some(
      (r) => r.name.trim().toLowerCase() === cleanName.toLowerCase()
    );

    if (nameExistsLocally) {
      setNameError(`O nome "${cleanName}" já foi utilizado por outro participante. Por favor, adicione seu sobrenome.`);
      soundService.playPop();
      return;
    }

    // Check device fingerprint locally
    if (deviceAlreadyParticipated) {
      setNameError('Este dispositivo já participou do quiz anteriormente.');
      return;
    }

    // Check availability in SQLite database
    try {
      const serverCheck = await checkUserAvailability(cleanName, currentDeviceFp);
      if (serverCheck.nameTaken) {
        setNameError(`O nome "${cleanName}" já foi cadastrado no banco SQLite. Por favor, adicione seu sobrenome.`);
        soundService.playPop();
        return;
      }
      if (serverCheck.deviceParticipated) {
        setNameError(`Este dispositivo já realizou o quiz no banco de dados (${serverCheck.existingUserName || 'participante registrado'}).`);
        soundService.playPop();
        return;
      }
    } catch {
      // Fallback if network offline
    }

    setNameError(null);

    // Shuffle questions and their options
    const randomizedQuestions: ShuffledQuestion[] = [...QUIZ_QUESTIONS]
      .sort(() => Math.random() - 0.5)
      .map((q) => {
        const mappedOptions = q.options.map((optText, origIdx) => ({
          text: optText,
          isCorrect: origIdx === q.correctAnswer,
          originalIndex: origIdx,
        }));
        // Shuffle the 5 options
        const shuffledOpts = [...mappedOptions].sort(() => Math.random() - 0.5);

        return {
          id: q.id,
          question: q.question,
          options: shuffledOpts,
          explanation: q.explanation,
        };
      });

    setShuffledQuestions(randomizedQuestions);
    setCurrentIdx(0);
    setSelectedOptionIdx(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setElapsedSeconds(0);
    setIsComplete(false);
    setHasStarted(true);
    soundService.playSuccess();
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOptionIdx(idx);
    soundService.playPop();
  };

  const currentQ = shuffledQuestions[currentIdx];

  const handleSubmitAnswer = () => {
    if (selectedOptionIdx === null || isAnswerSubmitted || !currentQ) return;
    setIsAnswerSubmitted(true);

    const chosenOption = currentQ.options[selectedOptionIdx];
    if (chosenOption.isCorrect) {
      setScore((s) => s + 1);
      soundService.playSuccess();
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < shuffledQuestions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOptionIdx(null);
      setIsAnswerSubmitted(false);
    } else {
      // Quiz Finished!
      setIsComplete(true);
      const cleanName = userName.trim();
      setStoredUser(cleanName);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('elnino_quiz_has_completed', 'true');
        } catch {}
      }
      onFinishQuiz(cleanName, score, elapsedSeconds, currentDeviceFp);
      soundService.playSuccess();
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // CASE 1: Before Fair Time
  if (fairStatus.status === 'before') {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center animate-in fade-in">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-xl space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-2 block">
              Feira de Ciências • 30/10/2026
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              O quiz estará disponível a partir das 08:30, durante a feira de ciências
            </h2>
            <p className="text-sm text-slate-600 mt-3 max-w-md mx-auto leading-relaxed">
              O desafio ficará aberto exclusivamente entre as <strong>08:30 e 11:30 da manhã</strong> do dia 30/10/2026.
            </p>
          </div>

          {/* Countdown indicator */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl max-w-sm mx-auto">
            <span className="text-xs uppercase font-bold text-slate-500 block mb-1">
              Tempo restante para abertura
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
              Explorar o Mapa Interativo
            </button>
          </div>
        </div>
      </div>
    );
  }

  // CASE 2: Device already completed the quiz
  if (deviceAlreadyParticipated && !hasStarted && !isComplete) {
    const existingName = getStoredUser();
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center animate-in fade-in">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-xl space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
            <UserCheck className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Você já completou o Quiz!
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
              Para assegurar a lisura da feira de ciências, cada dispositivo só pode registrar uma única participação oficial.
              {existingName && (
                <span className="block mt-2 font-semibold text-slate-800">
                  Participante registrado: &ldquo;{existingName}&rdquo;
                </span>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onGoToRanking()}
              className="px-6 py-2.5 rounded-xl bg-[#f95716] hover:bg-[#ea4e0f] text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
            >
              Ver Minha Posição no Ranking
            </button>
          </div>
        </div>
      </div>
    );
  }

  // CASE 3: Pre-Quiz Registration Screen (Input User Name)
  if (!hasStarted) {
    return (
      <div className="max-w-xl mx-auto py-10 px-4 animate-in fade-in">
        <div className="bg-white rounded-3xl p-6 sm:p-9 border border-slate-200/90 shadow-2xl space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#e6f1f5] border border-[#c7e1eb] text-[#174e64] text-xs font-semibold mb-3">
              <Trophy className="w-3.5 h-3.5 text-[#2b728e]" />
              <span>Desafio Oficial • 9 Questões</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Quiz do El Niño
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              As perguntas e alternativas serão exibidas em ordem aleatória. O tempo de resposta será computado em tempo real e valerá como critério de desempate!
            </p>
          </div>

          {/* Form */}
          <form onSubmit={startQuizSession} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Nome do Participante (único):
              </label>
              <input
                type="text"
                autoFocus
                required
                maxLength={40}
                placeholder="Ex: Ana Clara Silva"
                value={userName}
                onChange={(e) => {
                  setUserName(e.target.value);
                  setNameError(null);
                }}
                className={`w-full px-4 py-3 rounded-2xl border text-sm font-medium focus:outline-none transition-all ${
                  nameError
                    ? 'border-rose-400 bg-rose-50/50 focus:ring-2 focus:ring-rose-400'
                    : 'border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
                }`}
              />
              {nameError && (
                <div className="flex items-center gap-1.5 text-xs text-rose-600 font-semibold mt-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{nameError}</span>
                </div>
              )}
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
              Responda com atenção: tempo e acertos definirão o Pódio da Feira de Ciências!
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-[#f95716] hover:bg-[#ea4e0f] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 group"
            >
              <span>Iniciar Quiz Agora</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="flex items-center justify-start pt-2 border-t border-slate-100 text-xs text-slate-400">
            <button
              onClick={onBackToMap}
              className="hover:text-slate-700 transition-colors cursor-pointer"
            >
              ← Voltar ao Mapa
            </button>
          </div>
        </div>
      </div>
    );
  }

  // CASE 4: Active Question Answering Screen
  if (!isComplete && currentQ) {
    const letters = ['a)', 'b)', 'c)', 'd)', 'e)'];

    return (
      <div className="max-w-3xl mx-auto py-6 sm:py-10 animate-in fade-in duration-200">
        {/* Top Header with Real-Time Stopwatch */}
        <div className="flex items-center justify-between gap-4 mb-6 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Participante
            </span>
            <span className="font-bold text-slate-900 text-sm sm:text-base">
              {userName}
            </span>
          </div>

          {/* Real-time Timer */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-800">
            <Clock className="w-4 h-4 text-sky-600 animate-pulse" />
            <span className="font-mono text-base sm:text-lg font-black tracking-tight">
              {formatTime(elapsedSeconds)}
            </span>
          </div>
        </div>

        {/* Card for Active Question */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl relative">
          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full mb-6 overflow-hidden">
            <div 
              className="bg-[#f95716] h-full rounded-full transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / shuffledQuestions.length) * 100}%` }}
            />
          </div>

          {/* Question Index Header */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-3">
            <span>QUESTÃO {currentIdx + 1} DE {shuffledQuestions.length}</span>
            <span>ACERTOS: {score}</span>
          </div>

          {/* Question Text */}
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mb-6">
            {currentQ.question}
          </h3>

          {/* 5 Shuffled Options */}
          <div className="space-y-3 mb-6">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = selectedOptionIdx === optIdx;
              let optionStyle = 'bg-slate-50 border-slate-200 hover:border-sky-300 hover:bg-sky-50/40 text-slate-700';

              if (isAnswerSubmitted) {
                if (opt.isCorrect) {
                  optionStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold ring-1 ring-emerald-300';
                } else if (isSelected) {
                  // Seleção errada do usuário simbolizada em laranja (próximo ao vermelho)
                  optionStyle = 'bg-orange-50 border-orange-500 text-orange-950 font-semibold ring-2 ring-orange-300';
                } else {
                  optionStyle = 'bg-slate-50/50 border-slate-100 text-slate-400 opacity-50';
                }
              } else if (isSelected) {
                // Questão selecionada pelo usuário em azul claro
                optionStyle = 'bg-sky-50 border-sky-400 text-sky-950 font-semibold ring-2 ring-sky-200 shadow-xs';
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={isAnswerSubmitted}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${optionStyle}`}
                >
                  <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    isAnswerSubmitted && opt.isCorrect
                      ? 'bg-emerald-600 text-white'
                      : isAnswerSubmitted && isSelected
                      ? 'bg-orange-600 text-white'
                      : isSelected
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-500'
                  }`}>
                    {letters[optIdx]}
                  </span>
                  <span className="text-xs sm:text-sm leading-relaxed flex-grow">
                    {opt.text}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Explanation if submitted */}
          {isAnswerSubmitted && (
            <div className={`p-4 rounded-2xl mb-6 text-xs sm:text-sm leading-relaxed animate-in fade-in ${
              currentQ.options[selectedOptionIdx!]?.isCorrect
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                : 'bg-orange-50 border border-orange-200 text-orange-900'
            }`}>
              <div className="flex items-center gap-2 font-bold mb-1">
                {currentQ.options[selectedOptionIdx!]?.isCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Correto! Excelente raciocínio científico.</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                    <span>Explicação científica (resposta incorreta):</span>
                  </>
                )}
              </div>
              <p>{currentQ.explanation}</p>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center justify-end gap-3 pt-2">
            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOptionIdx === null}
                className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white transition-all cursor-pointer ${
                  selectedOptionIdx === null
                    ? 'bg-slate-300 cursor-not-allowed'
                    : 'bg-[#f95716] hover:bg-[#ea4e0f] shadow-md hover:scale-102'
                }`}
              >
                Confirmar Resposta
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md transition-all cursor-pointer hover:scale-102"
              >
                <span>{currentIdx + 1 < shuffledQuestions.length ? 'Próxima Questão' : 'Finalizar e Ver Ranking'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // CASE 5: Quiz Completed Screen
  return (
    <div className="max-w-2xl mx-auto py-10 px-4 text-center animate-in fade-in">
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-2xl space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto shadow-inner">
          <Award className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#f95716] block mb-1">
            Desafio Concluído
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Parabéns, {userName}!
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Seus resultados foram gravados oficialmente no Ranking da Feira de Ciências.
          </p>
        </div>

        {/* Score & Time Badges */}
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
          <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200">
            <span className="text-[11px] uppercase font-bold text-orange-700 block mb-1">
              Acertos
            </span>
            <span className="text-3xl font-black text-orange-600">
              {score} <span className="text-sm text-slate-400">/ 9</span>
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200">
            <span className="text-[11px] uppercase font-bold text-sky-700 block mb-1">
              Tempo Total
            </span>
            <span className="text-3xl font-black text-sky-700 font-mono">
              {formatTime(elapsedSeconds)}
            </span>
          </div>
        </div>

        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs sm:text-sm text-emerald-900 font-semibold max-w-md mx-auto">
          👉 Seu nome foi armazenado e estará destacado com uma seta no Ranking!
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          <button
            onClick={() => onGoToRanking()}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#f95716] hover:bg-[#ea4e0f] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Trophy className="w-4 h-4" />
            <span>Ver Minha Posição no Ranking</span>
          </button>
          <button
            onClick={onBackToMap}
            className="px-5 py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors cursor-pointer"
          >
            Voltar ao Mapa Interativo
          </button>
        </div>
      </div>
    </div>
  );
};
