// Root layout that wires the shared navigation and styling.
import './globals.css';
import Link from 'next/link';
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="layout-header">
          <div className="logo">Liga de Fantasia FIFA</div>
          <nav>
            <Link href="/">Inicio</Link>
            <Link href="/clubs">Clubes</Link>
            <Link href="/players">Jugadores</Link>
            <Link className="nav-wip" href="/compare">
              Comparar (WIP)
            </Link>
            <Link href="/draft-explorer">Explorador</Link>
          </nav>
        </header>
        <div className="wip-banner">
          <div>
            <strong>WIP:</strong> Algunas secciones siguen en obra. Si ves un enlace morado, es work-in-progress.
          </div>
          <img
            src="https://i.imgur.com/OCyjHNF.png"
            alt="Trabajadores WIP"
            className="wip-image"
          />
        </div>
        <main className="layout-main">{children}</main>
      </body>
    </html>
  );
}
