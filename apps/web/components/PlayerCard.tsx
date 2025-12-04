import type { Player } from '@domain/models';

type Props = { player: Player };

export const PlayerCard = ({ player }: Props) => (
  <div className="card">
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <div style={{ fontWeight: 700 }}>{player.name}</div>
        <div style={{ color: '#94a3b8' }}>
          {player.position} • {player.nationality}
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div>OVR {player.overall}</div>
        <small style={{ color: '#94a3b8' }}>Potential {player.potential}</small>
      </div>
    </div>
    <div style={{ display: 'flex', gap: '12px', marginTop: 12, flexWrap: 'wrap' }}>
      {[
        ['PAC', player.pace],
        ['SHO', player.shooting],
        ['PAS', player.passing],
        ['DRI', player.dribbling],
        ['DEF', player.defending],
        ['PHY', player.physicality]
      ].map(([label, value]) => (
        <div key={label} style={{ background: '#0f172a', padding: '6px 8px', borderRadius: 8 }}>
          <strong style={{ marginRight: 6 }}>{label}</strong>
          <span>{value}</span>
        </div>
      ))}
    </div>
  </div>
);
