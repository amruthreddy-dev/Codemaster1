import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './server/apiRouter.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true, limit: '5mb' }));

  // Health endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      event: 'Code Masters 2026',
      department: 'CSE (AI & ML), Vel Tech University',
      timestamp: new Date().toISOString(),
    });
  });

  // Mount competition API
  app.use('/api', apiRouter);

  // Serve static public assets explicitly
  app.use('/public', express.static(path.join(process.cwd(), 'public')));

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CODE MASTERS SERVER] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[CODE MASTERS SERVER] Fatal start error:', err);
  process.exit(1);
});
