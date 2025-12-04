import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { prisma } from '../../packages/infrastructure/src/prisma';

type PlayerRow = {
  fifa_id: string;
  short_name: string;
  club_name: string;
  nationality_name: string;
  player_positions: string;
  overall: string;
  potential: string;
  value_eur: string;
  wage_eur: string;
  age: string;
  height_cm: string;
  weight_kg: string;
  preferred_foot: string;
  weak_foot: string;
  skill_moves: string;
  pace: string;
  shooting: string;
  passing: string;
  dribbling: string;
  defending: string;
  physic: string;
  gk_handling: string;
  gk_reflexes: string;
  traits: string;
};

const parseNumber = (value: string) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

const getPlayersCsvPath = () =>
  process.env.PLAYERS_CSV_PATH ||
  path.join(process.cwd(), 'prisma', 'seed', 'data', 'players_cleaned.csv');

const ensureClub = async (clubName: string) => {
  if (!clubName) return null;
  const club = await prisma.club.findFirst({ where: { name: clubName } });
  return club?.id ?? null;
};

const upsertPlayer = async (row: PlayerRow) => {
  const clubId = await ensureClub(row.club_name);
  return prisma.player.upsert({
    where: { kaggleId: Number(row.fifa_id) },
    create: {
      kaggleId: Number(row.fifa_id),
      name: row.short_name,
      clubId,
      position: row.player_positions.split(',')[0] ?? '',
      nationality: row.nationality_name,
      overall: parseNumber(row.overall) ?? 0,
      potential: parseNumber(row.potential) ?? 0,
      valueEUR: parseNumber(row.value_eur) ?? 0,
      wageEUR: parseNumber(row.wage_eur) ?? 0,
      age: parseNumber(row.age) ?? 0,
      heightCm: parseNumber(row.height_cm) ?? 0,
      weightKg: parseNumber(row.weight_kg) ?? 0,
      preferredFoot: row.preferred_foot || 'Right',
      weakFoot: parseNumber(row.weak_foot) ?? 3,
      skillMoves: parseNumber(row.skill_moves) ?? 3,
      pace: parseNumber(row.pace) ?? 0,
      shooting: parseNumber(row.shooting) ?? 0,
      passing: parseNumber(row.passing) ?? 0,
      dribbling: parseNumber(row.dribbling) ?? 0,
      defending: parseNumber(row.defending) ?? 0,
      physicality: parseNumber(row.physic) ?? 0,
      gkHandling: parseNumber(row.gk_handling),
      gkReflexes: parseNumber(row.gk_reflexes),
      traits: row.traits || null
    },
    update: {
      name: row.short_name,
      clubId,
      position: row.player_positions.split(',')[0] ?? '',
      nationality: row.nationality_name,
      overall: parseNumber(row.overall) ?? 0,
      potential: parseNumber(row.potential) ?? 0,
      valueEUR: parseNumber(row.value_eur) ?? 0,
      wageEUR: parseNumber(row.wage_eur) ?? 0,
      age: parseNumber(row.age) ?? 0,
      heightCm: parseNumber(row.height_cm) ?? 0,
      weightKg: parseNumber(row.weight_kg) ?? 0,
      preferredFoot: row.preferred_foot || 'Right',
      weakFoot: parseNumber(row.weak_foot) ?? 3,
      skillMoves: parseNumber(row.skill_moves) ?? 3,
      pace: parseNumber(row.pace) ?? 0,
      shooting: parseNumber(row.shooting) ?? 0,
      passing: parseNumber(row.passing) ?? 0,
      dribbling: parseNumber(row.dribbling) ?? 0,
      defending: parseNumber(row.defending) ?? 0,
      physicality: parseNumber(row.physic) ?? 0,
      gkHandling: parseNumber(row.gk_handling),
      gkReflexes: parseNumber(row.gk_reflexes),
      traits: row.traits || null
    }
  });
};

const main = async () => {
  const filePath = getPlayersCsvPath();
  if (!fs.existsSync(filePath)) {
    throw new Error(`CSV not found at ${filePath}`);
  }

  const rows: PlayerRow[] = [];

  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => rows.push(data as PlayerRow))
      .on('end', resolve)
      .on('error', reject);
  });

  for (const row of rows) {
    await upsertPlayer(row);
  }
};

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('Players seeded');
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
