import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Store SQLite database path (configurable via DATABASE_PATH env var, e.g. for Docker volume)
const defaultDbPath = path.resolve(__dirname, '../../elnino.sqlite');
const dbPath = process.env.DATABASE_PATH ? path.resolve(process.env.DATABASE_PATH) : defaultDbPath;

// Ensure target directory exists (e.g. /app/data in Docker container)
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new Database(dbPath);

// Enable WAL (Write-Ahead Logging) for fast concurrent reads and writes
db.pragma('journal_mode = WAL');

// Initialize database schema
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS ranking (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL COLLATE NOCASE,
      score INTEGER NOT NULL,
      total_questions INTEGER NOT NULL DEFAULT 9,
      time_seconds INTEGER NOT NULL,
      date TEXT NOT NULL,
      school_grade TEXT,
      device_fingerprint TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE UNIQUE INDEX IF NOT EXISTS idx_ranking_name ON ranking(LOWER(TRIM(name)));
    CREATE INDEX IF NOT EXISTS idx_ranking_device ON ranking(device_fingerprint);
  `);

  // Seed default ranking if table is empty
  const countRow = db.prepare('SELECT COUNT(*) as count FROM ranking').get() as { count: number };
  if (countRow.count === 0) {
    seedInitialRanking();
  }
}

export interface DbRankingRow {
  id: number;
  name: string;
  score: number;
  total_questions: number;
  time_seconds: number;
  date: string;
  school_grade: string | null;
  device_fingerprint: string | null;
  created_at: string;
}

export function seedInitialRanking() {
  const seeds = [
    { name: 'Beatriz Almeida', score: 9, totalQuestions: 9, timeSeconds: 68, date: '30/10/2026', schoolGrade: '3º Ano E.M.', deviceFingerprint: 'seed_device_1' },
    { name: 'Lucas Vasconcelos', score: 9, totalQuestions: 9, timeSeconds: 79, date: '30/10/2026', schoolGrade: '2º Ano E.M.', deviceFingerprint: 'seed_device_2' },
    { name: 'Mariana Duarte', score: 8, totalQuestions: 9, timeSeconds: 62, date: '30/10/2026', schoolGrade: '1º Ano E.M.', deviceFingerprint: 'seed_device_3' },
    { name: 'Rafael Guimarães', score: 8, totalQuestions: 9, timeSeconds: 74, date: '30/10/2026', schoolGrade: '3º Ano E.M.', deviceFingerprint: 'seed_device_4' },
    { name: 'Camila Siqueira', score: 7, totalQuestions: 9, timeSeconds: 85, date: '30/10/2026', schoolGrade: '9º Ano E.F.', deviceFingerprint: 'seed_device_5' }
  ];

  const insertSeed = db.prepare(`
    INSERT INTO ranking (name, score, total_questions, time_seconds, date, school_grade, device_fingerprint)
    VALUES (@name, @score, @totalQuestions, @timeSeconds, @date, @schoolGrade, @deviceFingerprint)
  `);

  const insertMany = db.transaction((items) => {
    for (const item of items) {
      insertSeed.run(item);
    }
  });

  insertMany(seeds);
}

export function getAllRanking() {
  const rows = db.prepare(`
    SELECT 
      id, 
      name, 
      score, 
      total_questions as totalQuestions, 
      time_seconds as timeSeconds, 
      date, 
      school_grade as schoolGrade, 
      device_fingerprint as deviceFingerprint,
      created_at as createdAt
    FROM ranking
    ORDER BY score DESC, time_seconds ASC, id ASC
  `).all() as any[];

  return rows.map((r) => ({
    ...r,
    id: String(r.id),
  }));
}

export function checkUserExists(name?: string, deviceFp?: string) {
  let nameTaken = false;
  let deviceParticipated = false;
  let existingUserName: string | null = null;

  if (name && typeof name === 'string' && name.trim()) {
    const found = db.prepare('SELECT name FROM ranking WHERE LOWER(TRIM(name)) = LOWER(TRIM(?))').get(name.trim()) as { name: string } | undefined;
    if (found) {
      nameTaken = true;
    }
  }

  if (deviceFp && typeof deviceFp === 'string' && deviceFp.trim() && !deviceFp.startsWith('seed_')) {
    const foundDev = db.prepare('SELECT name FROM ranking WHERE device_fingerprint = ?').get(deviceFp.trim()) as { name: string } | undefined;
    if (foundDev) {
      deviceParticipated = true;
      existingUserName = foundDev.name;
    }
  }

  return { nameTaken, deviceParticipated, existingUserName };
}

export function insertRankingEntry(data: {
  name: string;
  score: number;
  timeSeconds: number;
  deviceFingerprint?: string;
  schoolGrade?: string;
}) {
  const trimmedName = data.name.trim();

  // Check unique username
  const existingName = db.prepare('SELECT id, name FROM ranking WHERE LOWER(TRIM(name)) = LOWER(TRIM(?))').get(trimmedName) as { id: number; name: string } | undefined;
  if (existingName) {
    throw new Error(`O nome "${trimmedName}" já foi cadastrado no ranking. Por favor, adicione seu sobrenome.`);
  }

  // Check device anti-duplicity
  if (data.deviceFingerprint && !data.deviceFingerprint.startsWith('seed_')) {
    const existingDevice = db.prepare('SELECT id, name FROM ranking WHERE device_fingerprint = ?').get(data.deviceFingerprint) as { id: number; name: string } | undefined;
    if (existingDevice) {
      throw new Error(`Este dispositivo já registrou uma participação no quiz com o nome "${existingDevice.name}".`);
    }
  }

  // Date formatted for Brazil (DD/MM/YYYY)
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const dateStr = `${day}/${month}/${year}`;

  const numScore = Math.max(0, Math.min(9, Number(data.score) || 0));
  const numTime = Math.max(1, Number(data.timeSeconds) || 60);

  const stmt = db.prepare(`
    INSERT INTO ranking (name, score, total_questions, time_seconds, date, school_grade, device_fingerprint)
    VALUES (?, ?, 9, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    trimmedName,
    numScore,
    numTime,
    dateStr,
    data.schoolGrade || 'Participante Feira 2026',
    data.deviceFingerprint || null
  );

  return {
    id: String(result.lastInsertRowid),
    name: trimmedName,
    score: numScore,
    totalQuestions: 9,
    timeSeconds: numTime,
    date: dateStr,
    schoolGrade: data.schoolGrade || 'Participante Feira 2026',
    deviceFingerprint: data.deviceFingerprint,
  };
}

export function resetRankingTable() {
  db.prepare('DELETE FROM ranking').run();
  seedInitialRanking();
}

export function clearRankingTable() {
  db.prepare('DELETE FROM ranking').run();
}

export function getDatabaseStats() {
  const countRow = db.prepare('SELECT COUNT(*) as total FROM ranking').get() as { total: number };
  const avgRow = db.prepare('SELECT AVG(score) as avgScore, MIN(time_seconds) as bestTime FROM ranking').get() as { avgScore: number | null; bestTime: number | null };
  return {
    totalParticipants: countRow.total,
    avgScore: avgRow.avgScore ? Math.round(avgRow.avgScore * 10) / 10 : 0,
    bestTimeSeconds: avgRow.bestTime || 0,
    dbEngine: 'SQLite 3 (better-sqlite3)',
    dbFile: 'elnino.sqlite',
  };
}
