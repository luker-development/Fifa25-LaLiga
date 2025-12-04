export type Club = {
  id: string;
  name: string;
  badgeUrl: string;
  league: string;
  overall: number;
  attack: number;
  midfield: number;
  defense: number;
};

export type Player = {
  id: string;
  kaggleId: number;
  name: string;
  clubId: string | null;
  position: string;
  nationality: string;
  overall: number;
  potential: number;
  valueEUR: number;
  wageEUR: number;
  age: number;
  heightCm: number;
  weightKg: number;
  preferredFoot: string;
  weakFoot: number;
  skillMoves: number;
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physicality: number;
  gkHandling?: number | null;
  gkReflexes?: number | null;
  traits?: string | null;
};

export type DraftSession = {
  id: string;
  name: string;
  budget: number;
  maxPlayers: number;
  snake: boolean;
};

export type DraftTeam = {
  id: string;
  name: string;
  owner: string;
  sessionId: string;
  budgetRemaining: number;
};

export type DraftPick = {
  id: string;
  sessionId: string;
  roundId: string;
  teamId: string;
  playerId: string;
  cost: number;
};
