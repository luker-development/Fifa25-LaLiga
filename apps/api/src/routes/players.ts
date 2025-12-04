import { Router } from 'express';
import { prisma } from '@infrastructure/prisma';
import { buildPagination } from '@shared/pagination';
import { buildLikeFilter, mapFilters } from '@shared/filtering';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { take, skip } = buildPagination({
      page: Number(req.query.page) || 1,
      pageSize: Number(req.query.pageSize) || 20,
      maxPageSize: 100
    });

    const filters = mapFilters(req.query, {
      clubId: 'clubId',
      position: 'position',
      nationality: 'nationality'
    });

    const name = typeof req.query.name === 'string' ? req.query.name : undefined;
    const minOverall = req.query.minOverall ? Number(req.query.minOverall) : undefined;
    const maxOverall = req.query.maxOverall ? Number(req.query.maxOverall) : undefined;

    const where = {
      ...filters,
      name: buildLikeFilter(name),
      overall: minOverall || maxOverall ? { gte: minOverall, lte: maxOverall } : undefined
    };

    const [total, data] = await Promise.all([
      prisma.player.count({ where }),
      prisma.player.findMany({
        where,
        orderBy: { overall: 'desc' },
        skip,
        take
      })
    ]);

    res.json({ total, data, page: Number(req.query.page) || 1, pageSize: take });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const player = await prisma.player.findUnique({
      where: { id: req.params.id },
      include: { club: true }
    });
    if (!player) {
      res.status(404).json({ error: 'Player not found' });
      return;
    }
    res.json(player);
  } catch (err) {
    next(err);
  }
});

router.get('/:id/compare', async (req, res, next) => {
  try {
    const withId = typeof req.query.with === 'string' ? req.query.with : undefined;
    if (!withId) {
      res.status(400).json({ error: 'Missing compare player id' });
      return;
    }
    const players = await prisma.player.findMany({
      where: { id: { in: [req.params.id, withId] } }
    });
    if (players.length !== 2) {
      res.status(404).json({ error: 'One or both players not found' });
      return;
    }
    res.json(players);
  } catch (err) {
    next(err);
  }
});

export default router;
