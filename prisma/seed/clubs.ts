import { prisma } from '../../packages/infrastructure/src/prisma';

const clubs = [
  {
    name: 'Real Madrid',
    badgeUrl: 'https://example.com/badges/realmadrid.png',
    league: 'La Liga',
    overall: 86,
    attack: 88,
    midfield: 85,
    defense: 84
  },
  {
    name: 'FC Barcelona',
    badgeUrl: 'https://example.com/badges/barcelona.png',
    league: 'La Liga',
    overall: 84,
    attack: 85,
    midfield: 84,
    defense: 83
  }
  // TODO: add remaining curated clubs (total 87)
];

const main = async () => {
  for (const club of clubs) {
    await prisma.club.upsert({
      where: { name: club.name },
      create: club,
      update: club
    });
  }
};

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log(`Seeded ${clubs.length} clubs`);
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
