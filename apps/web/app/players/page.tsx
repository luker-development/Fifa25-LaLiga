import { apiFetch } from '../../lib/api';
import { PlayerCard } from '../../components/PlayerCard';
import type { Player } from '@domain/models';

type PlayersResponse = { data: Player[]; total: number; page: number; pageSize: number };

export default async function PlayersPage({
  searchParams
}: {
  searchParams: { position?: string; nationality?: string; name?: string };
}) {
  const query = new URLSearchParams();
  if (searchParams.position) query.set('position', searchParams.position);
  if (searchParams.nationality) query.set('nationality', searchParams.nationality);
  if (searchParams.name) query.set('name', searchParams.name);

  const players = await apiFetch<PlayersResponse>(`/players?${query.toString()}`);

  return (
    <div className="grid">
      <div className="card">
        <h1>Players</h1>
        <p>Filters: use query params like ?position=ST&nationality=Spain&name=Pedri.</p>
        <p>Total found: {players.total}</p>
      </div>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        {players.data.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </div>
  );
}
