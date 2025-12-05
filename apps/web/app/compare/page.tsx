import { apiFetch } from '../../lib/api';
import type { Player } from '@domain/models';

const fetchPair = async (a: string, b: string) =>
  apiFetch<Player[]>(`/players/${a}/compare?with=${b}`);

export default async function ComparePage({
  searchParams
}: {
  searchParams: Promise<{ a?: string; b?: string }>;
}) {
  const { a, b } = await searchParams;
  const canCompare = a && b;
  const players = canCompare ? await fetchPair(a, b) : [];

  return (
    <div className="grid">
      <div className="card">
        <h1>Compare Players</h1>
        <p>Use query params ?a=playerId&b=playerId to compare two players.</p>
      </div>
      {canCompare && players.length === 2 && (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {players.map((p) => (
            <div key={p.id} className="card">
              <h3>{p.name}</h3>
              <p>
                {p.position} • {p.nationality}
              </p>
              <p>Overall {p.overall}</p>
              <p>
                Pace {p.pace} | Shooting {p.shooting} | Passing {p.passing}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
