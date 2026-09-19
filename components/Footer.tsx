import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <div className="footer-brand">Mairie de Kintélé</div>
          <p>Un portail municipal clair, accessible et proche des habitants.</p>
          <p className="muted">Département de Brazzaville · République du Congo</p>
        </div>
        <div>
          <h3>Accès rapides</h3>
          <Link href="/demarches">Démarches administratives</Link>
          <Link href="/actualites">Actualités municipales</Link>
          <Link href="/commune">Découvrir Kintélé</Link>
        </div>
        <div>
          <h3>La mairie</h3>
          <p>Avenue de l’Université, Kintélé</p>
          <p>Du lundi au vendredi · 8h00–15h30</p>
          <a href="mailto:mairie@kintele.cg">mairie@kintele.cg</a>
          <Link href="/contact">Nous contacter</Link>
        </div>
        <div>
          <h3>Transparence</h3>
          <Link href="/sources">Sources & crédits</Link>
          <Link href="/mentions-legales">Mentions légales</Link>
          <Link href="/accessibilite">Accessibilité</Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 Commune de Kintélé</span>
        <span>Conception numérique LoukaTech</span>
      </div>
    </footer>
  );
}
