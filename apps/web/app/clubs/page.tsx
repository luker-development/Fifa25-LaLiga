import { apiFetch } from '../../lib/api';
import { ClubCard } from '../../components/ClubCard';
import type { Club } from '@domain/models';

export default async function ClubsPage() {
  const clubs = await apiFetch<Club[]>('/clubs');

  return (
    <div className="grid">
      <div className="card">
        <h1>Clubs</h1>
        <p>Allowed clubs with ratings. Use filters via query params soon.</p>
      </div>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        {clubs.map((club) => (
          <ClubCard key={club.id} club={club} />
        ))}
      </div>
    </div>
  );
}
