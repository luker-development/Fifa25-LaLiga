-- CreateTable
CREATE TABLE "Club" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "badgeUrl" TEXT NOT NULL,
    "league" TEXT NOT NULL,
    "overall" INTEGER NOT NULL,
    "attack" INTEGER NOT NULL,
    "midfield" INTEGER NOT NULL,
    "defense" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "kaggleId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "clubId" TEXT,
    "position" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "overall" INTEGER NOT NULL,
    "potential" INTEGER NOT NULL,
    "valueEUR" INTEGER NOT NULL,
    "wageEUR" INTEGER NOT NULL,
    "age" INTEGER NOT NULL,
    "heightCm" INTEGER NOT NULL,
    "weightKg" INTEGER NOT NULL,
    "preferredFoot" TEXT NOT NULL,
    "weakFoot" INTEGER NOT NULL,
    "skillMoves" INTEGER NOT NULL,
    "pace" INTEGER NOT NULL,
    "shooting" INTEGER NOT NULL,
    "passing" INTEGER NOT NULL,
    "dribbling" INTEGER NOT NULL,
    "defending" INTEGER NOT NULL,
    "physicality" INTEGER NOT NULL,
    "gkHandling" INTEGER,
    "gkReflexes" INTEGER,
    "traits" TEXT,
    CONSTRAINT "Player_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DraftSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "budget" INTEGER NOT NULL,
    "maxPlayers" INTEGER NOT NULL,
    "snake" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "DraftTeam" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "budgetRemaining" INTEGER NOT NULL,
    CONSTRAINT "DraftTeam_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "DraftSession" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DraftRound" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "roundNumber" INTEGER NOT NULL,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "DraftRound_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "DraftSession" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DraftPick" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "roundId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "cost" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DraftPick_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "DraftSession" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DraftPick_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "DraftRound" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DraftPick_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "DraftTeam" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DraftPick_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Club_name_key" ON "Club"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Player_kaggleId_key" ON "Player"("kaggleId");

-- CreateIndex
CREATE INDEX "Player_clubId_idx" ON "Player"("clubId");

-- CreateIndex
CREATE INDEX "DraftTeam_sessionId_idx" ON "DraftTeam"("sessionId");

-- CreateIndex
CREATE INDEX "DraftRound_sessionId_idx" ON "DraftRound"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "DraftRound_sessionId_roundNumber_key" ON "DraftRound"("sessionId", "roundNumber");

-- CreateIndex
CREATE UNIQUE INDEX "DraftPick_playerId_key" ON "DraftPick"("playerId");

-- CreateIndex
CREATE INDEX "DraftPick_sessionId_idx" ON "DraftPick"("sessionId");

-- CreateIndex
CREATE INDEX "DraftPick_roundId_idx" ON "DraftPick"("roundId");

-- CreateIndex
CREATE INDEX "DraftPick_teamId_idx" ON "DraftPick"("teamId");
