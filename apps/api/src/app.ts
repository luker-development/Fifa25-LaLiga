import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { json } from 'body-parser';
import clubsRouter from './routes/clubs';
import playersRouter from './routes/players';
import draftRouter from './routes/draft';
import staticPlayersRouter from './routes/playersStatic';

const createApp = () => {
  const app = express();
  app.use(cors());
  app.use(helmet());
  app.use(json({ limit: '2mb' }));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  // Surface the pre-processed dataset used by the Draft Explorer prototype.
  app.use('/api', staticPlayersRouter);
  app.use('/clubs', clubsRouter);
  app.use('/players', playersRouter);
  app.use('/draft', draftRouter);

  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const status = err?.status ?? 500;
    res.status(status).json({ error: err?.message ?? 'Unexpected error' });
  });

  return app;
};

export default createApp;
