import { Router } from 'express';
import { prisma } from '@infrastructure/prisma';
import { buildLikeFilter, mapFilters } from '@shared/filtering';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const filters = mapFilters(req.query, { league: 'league' });
    const name = typeof req.query.name === 'string' ? req.query.name : undefined;

    const clubs = await prisma.club.findMany({
      where: {
        ...filters,
        name: buildLikeFilter(name)
      },
      orderBy: [{ league: 'asc' }, { name: 'asc' }]
    });
    res.json(clubs);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const club = await prisma.club.findUnique({ where: { id: req.params.id } });
    if (!club) {
      res.status(404).json({ error: 'Club not found' });
      return;
    }
    res.json(club);
  } catch (err) {
    next(err);
  }
});

export default router;
