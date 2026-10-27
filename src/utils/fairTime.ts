export type FairOverride = 'real' | 'bypass' | 'before' | 'during' | 'after';

export interface FairStatus {
  status: 'before' | 'during' | 'after';
  isQuizAllowed: boolean;
  override: FairOverride;
  secondsUntilStart: number;
  secondsUntilEnd: number;
  formattedTimeRemaining: string;
}

// Science fair schedule: 30/10/2026 from 08:00:00 to 10:00:00
export const FAIR_START_DATE = new Date('2026-10-30T08:00:00');
export const FAIR_END_DATE = new Date('2026-10-30T10:00:00');

export function getDeviceFingerprint(): string {
  if (typeof window === 'undefined') return 'server-device';
  try {
    let fp = localStorage.getItem('elnino_device_fingerprint');
    if (!fp) {
      const screenInfo = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`;
      const navInfo = `${navigator.userAgent}-${navigator.language}-${navigator.hardwareConcurrency || 4}`;
      const randomSeed = Math.random().toString(36).substring(2, 10);
      fp = `device_${btoa(`${screenInfo}_${navInfo}_${randomSeed}`).slice(0, 24)}`;
      localStorage.setItem('elnino_device_fingerprint', fp);
    }
    return fp;
  } catch {
    return 'fallback-device-id';
  }
}

export function resetDeviceFingerprint(): string {
  if (typeof window === 'undefined') return '';
  const newFp = `device_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`;
  localStorage.setItem('elnino_device_fingerprint', newFp);
  return newFp;
}

export function getStoredUser(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('current_quiz_user');
}

export function setStoredUser(name: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('current_quiz_user', name);
}

export function getFairOverride(): FairOverride {
  if (typeof window === 'undefined') return 'real';
  const val = localStorage.getItem('elnino_fair_override') as FairOverride | null;
  // If not set, default to 'bypass' in development/testing mode so user can test right away if they haven't explicitly set it, OR default to 'bypass' with an easy switcher.
  // Wait, the prompt says:
  // "O quiz só deve estar disponível no dia 30/10/2026 entre 08:00 e 10:00h da manhã (preciso de uma página secreta para ativar ou desativar essa regra para poder testar antes desse prazo)"
  // So 'real' evaluates the real date rule, but default can be 'real' or stored value!
  return val || 'real';
}

export function setFairOverride(override: FairOverride): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('elnino_fair_override', override);
}

export function calculateFairStatus(now: Date = new Date()): FairStatus {
  const override = getFairOverride();

  if (override === 'bypass') {
    return {
      status: 'during',
      isQuizAllowed: true,
      override: 'bypass',
      secondsUntilStart: 0,
      secondsUntilEnd: 7200,
      formattedTimeRemaining: '02:00:00 (Modo Livre Ativo)'
    };
  }

  if (override === 'before') {
    return {
      status: 'before',
      isQuizAllowed: false,
      override: 'before',
      secondsUntilStart: 3600,
      secondsUntilEnd: 10800,
      formattedTimeRemaining: '01:00:00'
    };
  }

  if (override === 'during') {
    return {
      status: 'during',
      isQuizAllowed: true,
      override: 'during',
      secondsUntilStart: 0,
      secondsUntilEnd: 3600,
      formattedTimeRemaining: '01:00:00'
    };
  }

  if (override === 'after') {
    return {
      status: 'after',
      isQuizAllowed: false,
      override: 'after',
      secondsUntilStart: 0,
      secondsUntilEnd: 0,
      formattedTimeRemaining: 'Encerrada'
    };
  }

  // Real clock calculation based on 30/10/2026
  const nowMs = now.getTime();
  const startMs = FAIR_START_DATE.getTime();
  const endMs = FAIR_END_DATE.getTime();

  if (nowMs < startMs) {
    const diffSec = Math.max(0, Math.floor((startMs - nowMs) / 1000));
    return {
      status: 'before',
      isQuizAllowed: false,
      override: 'real',
      secondsUntilStart: diffSec,
      secondsUntilEnd: Math.max(0, Math.floor((endMs - nowMs) / 1000)),
      formattedTimeRemaining: formatCountdown(diffSec)
    };
  } else if (nowMs >= startMs && nowMs <= endMs) {
    const diffSec = Math.max(0, Math.floor((endMs - nowMs) / 1000));
    return {
      status: 'during',
      isQuizAllowed: true,
      override: 'real',
      secondsUntilStart: 0,
      secondsUntilEnd: diffSec,
      formattedTimeRemaining: formatCountdown(diffSec)
    };
  } else {
    return {
      status: 'after',
      isQuizAllowed: false,
      override: 'real',
      secondsUntilStart: 0,
      secondsUntilEnd: 0,
      formattedTimeRemaining: 'Encerrada'
    };
  }
}

export function formatCountdown(totalSeconds: number): string {
  const d = Math.floor(totalSeconds / (3600 * 24));
  const h = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  if (d > 0) {
    return `${d}d ${h < 10 ? '0' : ''}${h}h ${m < 10 ? '0' : ''}${m}m ${s < 10 ? '0' : ''}${s}s`;
  }
  return `${h < 10 ? '0' : ''}${h}h ${m < 10 ? '0' : ''}${m}m ${s < 10 ? '0' : ''}${s}s`;
}
