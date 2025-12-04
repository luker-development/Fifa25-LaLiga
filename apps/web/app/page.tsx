import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="grid">
      <div className="card">
        <h1>Liga de Fantasia FIFA</h1>
        <p>
          Torneo familiar basado en planteles FIFA 25: 87 clubes curados, presupuesto compartido y draft en vivo.
        </p>
        <p>Explora jugadores, arma tu estrategia y preparate para el sorteo en casa.</p>
      </div>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <Link href="/clubs" className="card">
          <h3>Clubes</h3>
          <p>Listado de clubes habilitados para el torneo.</p>
        </Link>
        <Link href="/players" className="card">
          <h3>Jugadores</h3>
          <p>Filtra por posicion, nacionalidad y estadisticas.</p>
        </Link>
        <Link href="/compare" className="card nav-wip">
          <h3>Comparar (WIP)</h3>
          <p>Vista en desarrollo para comparar dos jugadores.</p>
        </Link>
        <Link href="/draft-explorer" className="card">
          <h3>Explorador de Draft</h3>
          <p>Tabla rapida con favoritos y filtros avanzados.</p>
        </Link>
      </div>
    </div>
  );
}
