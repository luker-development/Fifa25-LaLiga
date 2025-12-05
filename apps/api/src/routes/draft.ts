import { Prisma } from '@prisma/client';
import { Router } from 'express';
import { prisma } from '@infrastructure/prisma';
import { AppError } from '@shared/errors';

const router = Router();

router.post('/sessions', async (req, res, next) => {
  try {
    const { name, budget, maxPlayers, snake = true, teams = [] } = req.body;
    if (!name || !budget || !maxPlayers || !Array.isArray(teams) || teams.length === 0) {
      throw new AppError('Invalid payload', 400);
    }

    const session = await prisma.draftSession.create({
      data: {
        name,
        budget,
        maxPlayers,
        snake,
        teams: {
          create: teams.map((t: any) => ({
            name: t.name,
            owner: t.owner,
            budgetRemaining: budget
          }))
        },
        rounds: { create: [{ roundNumber: 1 }] }
      },
      include: { teams: true, rounds: true }
    });

    res.status(201).json(session);
  } catch (err) {
    next(err);
  }
});

router.get('/sessions/:id', async (req, res, next) => {
  try {
    const session = await prisma.draftSession.findUnique({
      where: { id: req.params.id },
      include: {
        teams: { include: { picks: { include: { player: true } } } },
        rounds: { include: { picks: true } }
      }
    });
    if (!session) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }
    res.json(session);
  } catch (err) {
    next(err);
  }
});

router.post('/sessions/:id/rounds/lock', async (req, res, next) => {
  try {
    const roundNumber = Number(req.body.roundNumber);
    if (!roundNumber) throw new AppError('roundNumber required', 400);
    const round = await prisma.draftRound.updateMany({
      where: { sessionId: req.params.id, roundNumber },
      data: { locked: true }
    });
    if (!round.count) throw new AppError('Round not found', 404);
    res.json({ locked: true, roundNumber });
  } catch (err) {
    next(err);
  }
});

router.post('/sessions/:id/rounds/unlock', async (req, res, next) => {
  try {
    const roundNumber = Number(req.body.roundNumber);
    if (!roundNumber) throw new AppError('roundNumber required', 400);
    const round = await prisma.draftRound.updateMany({
      where: { sessionId: req.params.id, roundNumber },
      data: { locked: false }
    });
    if (!round.count) throw new AppError('Round not found', 404);
    res.json({ locked: false, roundNumber });
  } catch (err) {
    next(err);
  }
});

router.post('/sessions/:id/picks', async (req, res, next) => {
  try {
    const sessionId = req.params.id;
    const { teamId, playerId, cost, roundNumber = 1 } = req.body;
    if (!teamId || !playerId || cost === undefined) throw new AppError('Missing fields', 400);

    const session = await prisma.draftSession.findUnique({
      where: { id: sessionId },
      include: { teams: true }
    });
    if (!session) throw new AppError('Session not found', 404);

    const team = session.teams.find(
      (t: { id: string; budgetRemaining: number }) => t.id === teamId
    );
    if (!team) throw new AppError('Team not in session', 400);
    if (team.budgetRemaining < cost) throw new AppError('Budget exceeded', 400);

    const picksCount = await prisma.draftPick.count({ where: { teamId } });
    if (picksCount >= session.maxPlayers) throw new AppError('Max players reached', 400);

    const playerAlreadyTaken = await prisma.draftPick.findFirst({ where: { playerId } });
    if (playerAlreadyTaken) throw new AppError('Player already drafted', 400);

    const round =
      (await prisma.draftRound.findFirst({
        where: { sessionId, roundNumber }
      })) ??
      (await prisma.draftRound.create({
        data: { sessionId, roundNumber }
      }));

    if (round.locked) throw new AppError('Round locked', 400);

    const pick = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const createdPick = await tx.draftPick.create({
        data: {
          sessionId,
          teamId,
          playerId,
          cost,
          roundId: round.id
        }
      });

      await tx.draftTeam.update({
        where: { id: teamId },
        data: { budgetRemaining: { decrement: cost } }
      });

      return createdPick;
    });

    res.status(201).json(pick);
  } catch (err) {
    next(err);
  }
});

export default router;
