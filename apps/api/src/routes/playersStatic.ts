// Serves the pre-processed players dataset for the Draft Explorer UI.
import { Router } from 'express';
import path from 'path';
import fs from 'fs';

type StaticPlayer = {
  id: number;
  name: string;
  positions: string;
  primary_position: string;
  nationality: string;
  overall_rating: number;
  potential: number;
  finishing: number;
  short_passing: number;
  value_euro: number;
};

let cachedPlayers: StaticPlayer[] | null = null;

const loadPlayers = (): StaticPlayer[] => {
  if (cachedPlayers) return cachedPlayers;
  const compiledPath = path.join(__dirname, '../data/players.min.json');
  const sourcePath = path.join(process.cwd(), 'apps', 'api', 'src', 'data', 'players.min.json');
  const filePath = fs.existsSync(compiledPath) ? compiledPath : sourcePath; // works for both ts-node and built output
  const file = fs.readFileSync(filePath, 'utf8');
  cachedPlayers = JSON.parse(file) as StaticPlayer[];
  return cachedPlayers;
};

const router = Router();

router.get('/players', (_req, res, next) => {
  try {
    const players = loadPlayers();
    res.json(players);
  } catch (err) {
    next(err);
  }
});

export default router;
