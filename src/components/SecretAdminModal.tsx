import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  RotateCcw, 
  Clock, 
  Unlock, 
  Calendar, 
  Smartphone, 
  Trash2,
  Check,
  Database
} from 'lucide-react';
import { 
  FairOverride, 
  getFairOverride, 
  setFairOverride, 
  resetDeviceFingerprint, 
  getDeviceFingerprint,
  getStoredUser
} from '../utils/fairTime';
import { 
  getFairOverrideFromServer, 
  updateFairOverrideOnServer 
} from '../services/rankingService';

interface SecretAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStateChanged: () => void;
  onResetRanking: () => void;
}

export const SecretAdminModal: React.FC<SecretAdminModalProps> = ({
  isOpen,
  onClose,
  onStateChanged,
  onResetRanking,
}) => {
  const [currentOverride, setCurrentOverride] = useState<FairOverride>(getFairOverride());
  const [currentFp, setCurrentFp] = useState<string>(getDeviceFingerprint());
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      getFairOverrideFromServer().then((ov) => {
        setCurrentOverride(ov);
      });
      setCurrentFp(getDeviceFingerprint());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectMode = async (mode: FairOverride) => {
    setCurrentOverride(mode);
    setFairOverride(mode);
    const success = await updateFairOverrideOnServer(mode);
    onStateChanged();
    if (success) {
      showMessage(`Regra salva no servidor SQLite para TODOS os aparelhos: ${getModeName(mode)}`);
    } else {
      showMessage(`Regra aplicada: ${getModeName(mode)}`);
    }
  };

  const showMessage = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleResetDevice = () => {
    const newFp = resetDeviceFingerprint();
    setCurrentFp(newFp);
    localStorage.removeItem('current_quiz_user');
    onStateChanged();
    showMessage('Impressão digital do dispositivo e usuário atual resetados! Você pode fazer o quiz novamente.');
  };

  const getModeName = (m: FairOverride) => {
    switch (m) {
      case 'bypass': return 'Liberado para Testes (Bypass)';
      case 'before': return 'Simular: Antes da Feira (< 08:30)';
      case 'during': return 'Simular: Durante a Feira (08:30 - 11:30)';
      case 'after': return 'Simular: Após a Feira (> 11:30)';
      case 'real': return 'Modo Relógio Oficial (30/10/2026 entre 08:30 e 11:30)';
    }
  };

  const currentUser = getStoredUser();

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-amber-300 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-amber-200 bg-amber-500 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-100" />
            <div>
              <h3 className="font-extrabold text-base leading-tight">
                Painel Secreto • Controle da Feira de Ciências
              </h3>
              <p className="text-xs text-amber-100 font-medium">
                Simulador de horários, bypass e gerenciamento de dispositivos para testes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar painel"
            className="w-8 h-8 rounded-full bg-amber-600 hover:bg-amber-700 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {statusMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Section 1: Override Modes */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
              Selecione o Estado do Horário da Feira:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Bypass */}
              <button
                onClick={() => handleSelectMode('bypass')}
                className={`p-3 rounded-2xl border text-left text-xs transition-all cursor-pointer flex items-start gap-2.5 ${
                  currentOverride === 'bypass'
                    ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-400 font-bold text-amber-950'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <Unlock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Liberado para Testes (Bypass)</div>
                  <div className="text-[11px] text-slate-500 font-normal">Permite fazer o quiz livremente agora</div>
                </div>
              </button>

              {/* Before */}
              <button
                onClick={() => handleSelectMode('before')}
                className={`p-3 rounded-2xl border text-left text-xs transition-all cursor-pointer flex items-start gap-2.5 ${
                  currentOverride === 'before'
                    ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-400 font-bold text-sky-950'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <Clock className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Antes da Feira (&lt; 08:30)</div>
                  <div className="text-[11px] text-slate-500 font-normal">Bloqueia quiz com aviso de abertura às 08:30</div>
                </div>
              </button>

              {/* During */}
              <button
                onClick={() => handleSelectMode('during')}
                className={`p-3 rounded-2xl border text-left text-xs transition-all cursor-pointer flex items-start gap-2.5 ${
                  currentOverride === 'during'
                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400 font-bold text-emerald-950'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <Calendar className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Durante a Feira (08:30 - 11:30)</div>
                  <div className="text-[11px] text-slate-500 font-normal">Quiz ativo com countdown para 11:30</div>
                </div>
              </button>

              {/* After */}
              <button
                onClick={() => handleSelectMode('after')}
                className={`p-3 rounded-2xl border text-left text-xs transition-all cursor-pointer flex items-start gap-2.5 ${
                  currentOverride === 'after'
                    ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-400 font-bold text-rose-950'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <RotateCcw className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Após a Feira (&gt; 11:30)</div>
                  <div className="text-[11px] text-slate-500 font-normal">Quiz finalizado, ranking mostra só o Pódio Top 3</div>
                </div>
              </button>
            </div>

            {/* Real Clock */}
            <div className="mt-2.5">
              <button
                onClick={() => handleSelectMode('real')}
                className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between ${
                  currentOverride === 'real'
                    ? 'bg-slate-900 border-slate-900 text-white font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>Usar Relógio Real Oficial (30/10/2026 entre 08:30 e 11:30)</span>
                {currentOverride === 'real' && <Check className="w-4 h-4 text-amber-400" />}
              </button>
            </div>
          </div>

          {/* Section 2: Device Fingerprint & LocalStorage */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <Smartphone className="w-4 h-4 text-slate-600" />
              <span>Fingerprint do Dispositivo Atual</span>
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <div>
                <span className="font-semibold text-slate-700">Hash ID: </span>
                <code className="bg-slate-200 px-1.5 py-0.5 rounded text-[11px] font-mono select-all">
                  {currentFp}
                </code>
              </div>
              <div>
                <span className="font-semibold text-slate-700">Usuário salvo localmente: </span>
                <span className="font-bold text-orange-600">
                  {currentUser || '(Nenhum usuário salvo ainda)'}
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-2">
              <button
                onClick={handleResetDevice}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Resetar Dispositivo (Permite Refazer Quiz)</span>
              </button>
              <button
                onClick={onResetRanking}
                className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700 text-slate-700 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Resetar Ranking SQLite</span>
              </button>
            </div>
          </div>

          {/* Section 3: SQLite Database Status */}
          <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/90 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 uppercase tracking-wider">
                <Database className="w-4 h-4 text-emerald-700" />
                <span>Banco de Dados: SQLite 3</span>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200/80 text-emerald-800">
                Ativo (WAL Mode)
              </span>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Os dados dos participantes são persistidos em arquivo SQLite local (<code>elnino.sqlite</code>), garantindo que os recordes do quiz permaneçam seguros entre reinicializações do servidor.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Pressione Esc para fechar este painel</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
