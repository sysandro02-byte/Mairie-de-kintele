import Link from "next/link";

export default function Header() {
  return (
    <>
      <div className="republic-bar">
        <div className="container republic-inner">
          <span>République du Congo</span>
          <span className="republic-motto">Unité • Travail • Progrès</span>
        </div>
      </div>
      <header className="site-header">
        <div className="container header-main">
          <Link href="/" className="brand" aria-label="Accueil — Mairie de Kintélé">
            <span className="brand-mark" aria-hidden="true">
              <i className="flag-green" />
              <i className="flag-yellow" />
              <i className="flag-red" />
            </span>
            <span>
              <strong>Mairie de Kintélé</strong>
              <small>Portail municipal</small>
            </span>
          </Link>
          <nav className="main-nav" aria-label="Navigation principale">
            <Link href="/demarches">Démarches</Link>
            <Link href="/commune">Ma commune</Link>
            <Link href="/actualites">Actualités</Link>
            <Link href="/contact">Contact</Link>
          </nav>
          <Link href="/demarches" className="header-cta">Mes démarches</Link>
        </div>
      </header>
    </>
  );
}
