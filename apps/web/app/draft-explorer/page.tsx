/* Explorador de Draft con filtros, favoritos y paginacion pensando en mobile. */
'use client';

import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../../lib/api';
import './draft-explorer.css';

type DraftPlayer = {
  id: number;
  name: string;
  positions: string;
  primary_position: string;
  nationality: string;
  overall_rating: number;
  potential: number;
  finishing: number;
  short_passing: number;
  value_euro: number;
};

const FAVORITES_KEY = 'draft-explorer:favorites';

const ATTRIBUTE_OPTIONS = [
  { value: 'overall_rating', label: 'Global' },
  { value: 'potential', label: 'Potencial' },
  { value: 'finishing', label: 'Definicion' },
  { value: 'short_passing', label: 'Pase corto' }
] as const;
type AttributeKey = (typeof ATTRIBUTE_OPTIONS)[number]['value'];

const POSITION_OPTIONS = [
  'GK',
  'SW',
  'RWB',
  'RB',
  'CB',
  'LB',
  'LWB',
  'CDM',
  'CM',
  'CAM',
  'RM',
  'LM',
  'RW',
  'LW',
  'CF',
  'ST'
];

const DEFAULT_TEAMS = [
  // España – LaLiga (Primera División)
  'Almería',
  'Cádiz',
  'Granada',

  // España – LaLiga Hypermotion (Segunda División)
  'Albacete',
  'Burgos',
  'Eibar',
  'Elche',
  'Eldense',
  'Levante',
  'Mirandés',
  'Racing Santander',
  'Real Oviedo',
  'Sporting Gijón',
  'Tenerife',
  'Zaragoza',

  // Italia – Serie A
  'Frosinone',
  'Salernitana',
  'Sassuolo',

  // Italia – Serie B
  'Bari',
  'Cittadella',
  'Cremonese',
  'Modena',
  'Palermo',
  'Pisa',
  'Reggiana',
  'Südtirol',
  'Sampdoria',

  // Alemania – (Bundesliga / 2. Bundesliga / 3. Liga) grupo torneo
  'FC Köln',
  'FC Kaiserslautern',
  'FC Nürnberg',
  'Eintracht Braunschweig',
  'SV Elversberg',
  'Hamburger SV',
  'Hannover 96',
  'Hertha BSC',
  'Karlsruher SC',
  'SC Paderborn 07',
  'FC Schalke 04',
  'SSV Jahn Regensburg',
  'SSV Ulm 1846',

  // Inglaterra – League Two
  'Accrington Stanley',
  'Barrow AFC',
  'Bradford City',
  'Bromley',
  'Carlisle United',
  'Cheltenham Town',
  'Chesterfield',
  'Colchester United',
  'Crewe Alexandra',
  'Doncaster Rovers',
  'Fleetwood Town',
  'Gillingham',
  'Grimsby Town',
  'Harrogate Town',
  'Milton Keynes Dons',
  'Morecambe',
  'Newport County',
  'Notts County',
  'Port Vale',
  'Salford City',
  'Swindon Town',
  'Tranmere Rovers',
  'Walsall',
  'AFC Wimbledon',

  // Dinamarca – Superliga
  'Aarhus GF (AGF)',
  'Brøndby IF',
  'FC København',
  'AC Lyngby',
  'FC Midtjylland',
  'FC Nordsjælland',
  'Randers FC',
  'Silkeborg IF',
  'Vejle Boldklub',
  'Viborg FF',

  // Australia – A-League
  'Adelaide United',
  'Auckland FC',
  'Brisbane Roar',
  'Central Coast Mariners',
  'Macarthur FC',
  'Melbourne City',
  'Melbourne Victory',
  'Newcastle Jets',
  'Perth Glory',
  'Sydney FC',
  'Wellington Phoenix',
  'Western United',
  'Western Sydney Wanderers'
];


const PAGE_SIZE = 50;

// Los valores vienen en EUR; mostramos en USD para el usuario.
const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(Math.max(0, Math.round(value)));

export default function DraftExplorerPage() {
  const [players, setPlayers] = useState<DraftPlayer[]>([]);
  // Use the curated in-repo list; avoid relying on remote data for the sidebar.
  const [clubs, setClubs] = useState<string[]>(DEFAULT_TEAMS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const [nameFilter, setNameFilter] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [nationalityFilter, setNationalityFilter] = useState('');
  const [attribute, setAttribute] = useState<AttributeKey>('overall_rating');
  const [attrMin, setAttrMin] = useState('');
  const [attrMax, setAttrMax] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [priceOnly, setPriceOnly] = useState(false);
  const [page, setPage] = useState(1);

  const deferredName = useDeferredValue(nameFilter);
  const deferredPosition = useDeferredValue(positionFilter);
  const deferredNationality = useDeferredValue(nationalityFilter);
  const deferredAttrMin = useDeferredValue(attrMin);
  const deferredAttrMax = useDeferredValue(attrMax);
  const deferredPriceMin = useDeferredValue(priceMin);
  const deferredPriceMax = useDeferredValue(priceMax);
  const deferredAttribute = useDeferredValue(attribute);

  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as number[];
        setFavorites(new Set(parsed));
      } catch {
        // ignore malformed storage content
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const playerData = await apiFetch<DraftPlayer[]>('/api/players');
        if (!active) return;
        setPlayers(playerData);
        setClubs(DEFAULT_TEAMS);
      } catch (err: any) {
        if (!active) return;
        setError(err?.message ?? 'Error al cargar jugadores');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setPage(1);
  }, [nameFilter, positionFilter, nationalityFilter, attribute, attrMin, attrMax, priceMin, priceMax, showFavoritesOnly, priceOnly]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredPlayers = useMemo(() => {
    const minAttr = deferredAttrMin ? Number(deferredAttrMin) : null;
    const maxAttr = deferredAttrMax ? Number(deferredAttrMax) : null;
    const minPrice = deferredPriceMin ? Number(deferredPriceMin) : null;
    const maxPrice = deferredPriceMax ? Number(deferredPriceMax) : null;
    const name = deferredName.trim().toLowerCase();
    const pos = deferredPosition.trim().toLowerCase();
    const nationality = deferredNationality.trim().toLowerCase();

    return players
      .filter((player) => {
        if (!priceOnly) {
          if (name && !player.name.toLowerCase().includes(name)) return false;
          if (
            pos &&
            !player.positions.toLowerCase().includes(pos) &&
            !player.primary_position.toLowerCase().includes(pos)
          )
            return false;
          if (nationality && !player.nationality.toLowerCase().includes(nationality)) return false;

          const attrValue = player[deferredAttribute] ?? 0;
          if (minAttr !== null && attrValue < minAttr) return false;
          if (maxAttr !== null && attrValue > maxAttr) return false;
        }

        if (minPrice !== null && player.value_euro < minPrice) return false;
        if (maxPrice !== null && player.value_euro > maxPrice) return false;

        if (showFavoritesOnly && !favorites.has(player.id)) return false;
        return true;
      })
      .sort((a, b) => {
        if (priceOnly) {
          return (b.value_euro ?? 0) - (a.value_euro ?? 0);
        }
        const primary = (b[deferredAttribute] ?? 0) - (a[deferredAttribute] ?? 0);
        if (primary !== 0) return primary;
        return b.overall_rating - a.overall_rating;
      });
  }, [
    players,
    deferredName,
    deferredPosition,
    deferredNationality,
    deferredAttribute,
    deferredAttrMin,
    deferredAttrMax,
    deferredPriceMin,
    deferredPriceMax,
    priceOnly,
    showFavoritesOnly,
    favorites
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredPlayers.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedPlayers = filteredPlayers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="draft-shell">
      <aside className="card draft-sidebar">
        <div className="sidebar-header">
          <h3>Clubes</h3>
          <p>Listado de 87 clubes del torneo (informativo).</p>
        </div>
        <div className="teams-list">
          {(clubs.length ? clubs : DEFAULT_TEAMS).map((team) => (
            <div key={team} className="team-pill">
              {team}
            </div>
          ))}
        </div>
      </aside>

      <section className="draft-content">
        <div className="card draft-hero">
          <div>
            <h1>Explorador de Draft</h1>
            <p>Filtros, favoritos y scouting rapido desde el endpoint de jugadores.</p>
          </div>
          <div className="hero-meta">
            <label className="favorite-toggle">
              <input
                type="checkbox"
                checked={showFavoritesOnly}
                onChange={(e) => setShowFavoritesOnly(e.target.checked)}
              />
              Solo favoritos
            </label>
            <label className="favorite-toggle">
              <input
                type="checkbox"
                checked={priceOnly}
                onChange={(e) => setPriceOnly(e.target.checked)}
              />
              Solo por precio
            </label>
            <span className="count-pill">
              {filteredPlayers.length} / {players.length} jugadores
            </span>
          </div>
        </div>

        <div className="card draft-filters">
          <div className="filter-field">
            <label>Nombre</label>
            <input
              type="text"
              value={nameFilter}
              placeholder="ej: Messi"
              onChange={(e) => setNameFilter(e.target.value)}
            />
          </div>
          <div className="filter-field">
            <label>Posicion</label>
            <select value={positionFilter} onChange={(e) => setPositionFilter(e.target.value)}>
              <option value="">Todas</option>
              {POSITION_OPTIONS.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-field">
            <label>Nacionalidad</label>
            <input
              type="text"
              value={nationalityFilter}
              placeholder="Argentina, Espana..."
              onChange={(e) => setNationalityFilter(e.target.value)}
            />
          </div>
          <div className="filter-field">
            <label>Atributo</label>
            <select value={attribute} onChange={(e) => setAttribute(e.target.value as AttributeKey)}>
              {ATTRIBUTE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-field">
            <label>Valor minimo</label>
            <input
              type="number"
              value={attrMin}
              min={0}
              max={99}
              onChange={(e) => setAttrMin(e.target.value)}
            />
          </div>
          <div className="filter-field">
            <label>Valor maximo</label>
            <input
              type="number"
              value={attrMax}
              min={0}
              max={99}
              onChange={(e) => setAttrMax(e.target.value)}
            />
          </div>
          <div className="filter-field">
            <label>Precio min. (USD)</label>
            <input
              type="number"
              value={priceMin}
              min={0}
              step={100000}
              onChange={(e) => setPriceMin(e.target.value)}
            />
          </div>
          <div className="filter-field">
            <label>Precio max. (USD)</label>
            <input
              type="number"
              value={priceMax}
              min={0}
              step={100000}
              onChange={(e) => setPriceMax(e.target.value)}
            />
          </div>
        </div>

        <div className="card draft-table-card">
          {loading && <div className="loading-row">Cargando jugadores...</div>}
          {error && !loading && <div className="error-row">{error}</div>}
          {!loading && !error && (
            <>
              <div className="table-scroll">
                <table className="draft-table">
                  <thead>
                    <tr>
                      <th>Fav</th>
                      <th>Nombre</th>
                      <th>Posiciones</th>
                      <th>Nacionalidad</th>
                      <th>Global</th>
                      <th>Potencial</th>
                      <th>Definicion</th>
                      <th>Pase corto</th>
                      <th>Valor (USD)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedPlayers.map((player) => (
                      <tr key={player.id}>
                        <td data-label="Fav">
                          <button
                            className="favorite-button"
                            onClick={() => toggleFavorite(player.id)}
                            aria-label="Marcar favorito"
                          >
                            {favorites.has(player.id) ? '\u2605' : '\u2606'}
                          </button>
                        </td>
                        <td data-label="Nombre">
                          <div className="player-name">{player.name}</div>
                          <div className="player-sub">Principal: {player.primary_position}</div>
                        </td>
                        <td data-label="Posiciones">{player.positions.replace(/,/g, ' / ')}</td>
                        <td data-label="Nacionalidad">{player.nationality}</td>
                        <td data-label="Global">{player.overall_rating}</td>
                        <td data-label="Potencial">{player.potential}</td>
                        <td data-label="Definición">{player.finishing}</td>
                        <td data-label="Pase corto">{player.short_passing}</td>
                        <td data-label="Valor">{formatCurrency(player.value_euro)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="pagination">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                >
                  Anterior
                </button>
                <span>Pagina {currentPage} de {totalPages} | {PAGE_SIZE} por pagina</span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                >
                  Siguiente
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
