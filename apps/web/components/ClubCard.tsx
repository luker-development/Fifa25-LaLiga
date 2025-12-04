import type { Club } from '@domain/models';

type Props = { club: Club };

export const ClubCard = ({ club }: Props) => (
  <div className="card">
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: '12px',
          background: '#0b1622',
          display: 'grid',
          placeItems: 'center',
          fontWeight: 700
        }}
      >
        {club.name.slice(0, 2).toUpperCase()}
      </div>
      <div>
        <div style={{ fontWeight: 700 }}>{club.name}</div>
        <div style={{ color: '#94a3b8' }}>{club.league}</div>
      </div>
      <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
        <div>OVR {club.overall}</div>
        <small style={{ color: '#94a3b8' }}>
          {club.attack}/{club.midfield}/{club.defense}
        </small>
      </div>
    </div>
  </div>
);
