import { RankingEntry } from '../types/elnino';
import { INITIAL_RANKING } from '../data/elninoData';
import { FairOverride, setFairOverride } from '../utils/fairTime';

const LOCAL_STORAGE_KEY = 'elnino_ranking';

export async function fetchRankingFromDatabase(): Promise<RankingEntry[]> {
  try {
    const res = await fetch('/api/ranking');
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    if (data.override) {
      setFairOverride(data.override as FairOverride);
    }
    if (data.success && Array.isArray(data.ranking)) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.ranking));
      } catch {}
      return data.ranking;
    }
    throw new Error('Resposta inválida do servidor');
  } catch (err) {
    console.warn('[RankingService] Falha ao conectar com SQLite, usando cache local:', err);
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) return JSON.parse(cached);
    } catch {}
    return INITIAL_RANKING;
  }
}

export async function submitQuizToDatabase(entry: {
  name: string;
  score: number;
  timeSeconds: number;
  deviceFingerprint: string;
  schoolGrade?: string;
}): Promise<{ success: boolean; entry?: RankingEntry; ranking?: RankingEntry[]; error?: string }> {
  try {
    const res = await fetch('/api/ranking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        error: data.error || 'Erro ao registrar no banco SQLite.',
      };
    }

    if (data.ranking) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.ranking));
      } catch {}
    }

    return {
      success: true,
      entry: data.entry,
      ranking: data.ranking,
    };
  } catch (err: any) {
    console.error('[RankingService] Falha de rede ao submeter quiz:', err);
    return {
      success: false,
      error: 'Erro de conexão com o banco de dados SQLite.',
    };
  }
}

export async function checkUserAvailability(
  name: string,
  deviceFp?: string
): Promise<{
  nameTaken: boolean;
  deviceParticipated: boolean;
  existingUserName?: string;
}> {
  try {
    const params = new URLSearchParams();
    if (name) params.append('name', name);
    if (deviceFp) params.append('device', deviceFp);

    const res = await fetch(`/api/check-user?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      return {
        nameTaken: !!data.nameTaken,
        deviceParticipated: !!data.deviceParticipated,
        existingUserName: data.existingUserName,
      };
    }
  } catch (err) {
    console.warn('[RankingService] Falha ao verificar disponibilidade no SQLite:', err);
  }

  return { nameTaken: false, deviceParticipated: false };
}

export async function resetDatabaseRanking(): Promise<RankingEntry[]> {
  try {
    const res = await fetch('/api/admin/reset', { method: 'POST' });
    const data = await res.json();
    if (data.ranking) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.ranking));
      } catch {}
      return data.ranking;
    }
  } catch (err) {
    console.error('[RankingService] Falha ao resetar banco SQLite:', err);
  }
  return INITIAL_RANKING;
}

export async function getDatabaseStats() {
  try {
    const res = await fetch('/api/admin/stats');
    if (res.ok) {
      const data = await res.json();
      return data.stats;
    }
  } catch {
    // ignore
  }
  return null;
}

export async function getFairOverrideFromServer(): Promise<FairOverride> {
  try {
    const res = await fetch('/api/fair-override');
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.override) {
        setFairOverride(data.override as FairOverride);
        return data.override as FairOverride;
      }
    }
  } catch (err) {
    console.warn('[RankingService] Falha ao obter override:', err);
  }
  return 'bypass';
}

export async function updateFairOverrideOnServer(override: FairOverride): Promise<boolean> {
  try {
    setFairOverride(override);
    const res = await fetch('/api/admin/fair-override', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ override }),
    });
    const data = await res.json();
    return !!data.success;
  } catch (err) {
    console.error('[RankingService] Falha ao enviar override:', err);
    return false;
  }
}
