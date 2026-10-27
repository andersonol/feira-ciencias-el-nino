import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  initDatabase,
  getAllRanking,
  insertRankingEntry,
  checkUserExists,
  resetRankingTable,
  clearRankingTable,
  getDatabaseStats
} from './src/server/db.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  // Initialize SQLite database schema and seeds
  initDatabase();

  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // --- API Endpoints ---

  // 1. GET /api/ranking - Fetch current official leaderboard from SQLite
  app.get('/api/ranking', (req, res) => {
    try {
      const ranking = getAllRanking();
      res.json({ success: true, ranking });
    } catch (err: any) {
      console.error('[SQLite] Erro ao buscar ranking:', err);
      res.status(500).json({ error: 'Erro ao carregar classificação do banco SQLite.' });
    }
  });

  // 2. GET /api/check-user - Verify if username or device already participated
  app.get('/api/check-user', (req, res) => {
    try {
      const name = req.query.name as string | undefined;
      const device = req.query.device as string | undefined;
      const result = checkUserExists(name, device);
      res.json({ success: true, ...result });
    } catch (err: any) {
      console.error('[SQLite] Erro ao verificar usuário:', err);
      res.status(500).json({ error: 'Erro ao verificar disponibilidade de usuário.' });
    }
  });

  // 3. POST /api/ranking - Record a new quiz completion into SQLite
  app.post('/api/ranking', (req, res) => {
    try {
      const { name, score, timeSeconds, deviceFingerprint, schoolGrade } = req.body;

      if (!name || typeof name !== 'string' || name.trim().length < 2) {
        return res.status(400).json({ error: 'Nome do participante é obrigatório (mínimo 2 caracteres).' });
      }

      const newEntry = insertRankingEntry({
        name,
        score,
        timeSeconds,
        deviceFingerprint,
        schoolGrade
      });

      const updatedRanking = getAllRanking();

      res.status(201).json({
        success: true,
        entry: newEntry,
        ranking: updatedRanking
      });
    } catch (err: any) {
      console.warn('[SQLite] Rejeição de inserção no ranking:', err.message);
      // Return 409 Conflict for duplicate user/device
      res.status(409).json({ error: err.message });
    }
  });

  // 4. POST /api/admin/reset - Reset SQLite table to seed data
  app.post('/api/admin/reset', (req, res) => {
    try {
      resetRankingTable();
      const ranking = getAllRanking();
      res.json({ success: true, message: 'Ranking SQLite resetado com sucesso para os dados padrão!', ranking });
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao resetar banco SQLite: ' + err.message });
    }
  });

  // 5. POST /api/admin/clear - Clear all records from SQLite
  app.post('/api/admin/clear', (req, res) => {
    try {
      clearRankingTable();
      res.json({ success: true, message: 'Todas as entradas do SQLite foram removidas.', ranking: [] });
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao limpar banco SQLite.' });
    }
  });

  // 6. GET /api/admin/stats - Get SQLite statistics
  app.get('/api/admin/stats', (req, res) => {
    try {
      const stats = getDatabaseStats();
      res.json({ success: true, stats });
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao obter estatísticas do banco SQLite.' });
    }
  });

  // --- Static & Frontend Serving ---
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[El Niño App] Servidor Full-Stack com SQLite ativo em http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[El Niño App] Falha ao iniciar o servidor:', err);
  process.exit(1);
});
