import { apiFetch } from '../../../lib/api';

type Params = { params: Promise<{ sessionId: string }> };

const fetchSession = (id: string) =>
  apiFetch<any>(`/draft/sessions/${id}`); // keep loose type for now

export default async function DraftSessionPage({ params }: Params) {
  const { sessionId } = await params;
  const session = await fetchSession(sessionId);

  return (
    <div className="grid">
      <div className="card">
        <h1>{session.name}</h1>
        <p>
          Budget per team: {session.budget} • Max players: {session.maxPlayers} • Snake:{' '}
          {session.snake ? 'Yes' : 'No'}
        </p>
      </div>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {session.teams?.map((team: any) => (
          <div key={team.id} className="card">
            <h3>{team.name}</h3>
            <p>Owner: {team.owner}</p>
            <p>Budget left: {team.budgetRemaining}</p>
            <ul>
              {team.picks?.map((pick: any) => (
                <li key={pick.id}>
                  {pick.player?.name || pick.playerId} - {pick.cost}
                </li>
              )) || <li>No picks yet</li>}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
