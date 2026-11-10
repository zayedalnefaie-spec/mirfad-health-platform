import 'dotenv/config';
import { createApp } from './app';

const app = createApp();
const PORT = Number(process.env.PORT) || 8787;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[MIRFAD Backend] Reference API running at http://localhost:${PORT}`);
  console.log(`[MIRFAD Backend] Mode: In-Memory Prototype (Hackathon evaluation only)`);
});

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('[MIRFAD Backend] Server closed');
  });
});
