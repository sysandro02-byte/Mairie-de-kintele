import Link from "next/link";

const services = [
  { icon: "◉", title: "État civil", text: "Actes de naissance, mariage, décès et légalisation.", href: "/demarches#etat-civil" },
  { icon: "⌂", title: "Urbanisme", text: "Renseignements, projets, autorisations et accompagnement.", href: "/demarches#urbanisme" },
  { icon: "✦", title: "Famille & jeunesse", text: "Orientation vers les services municipaux et de proximité.", href: "/demarches#famille" },
  { icon: "⚑", title: "Vie citoyenne", text: "Informations municipales, participation et rendez-vous.", href: "/demarches#citoyennete" },
  { icon: "♟", title: "Économie locale", text: "Commerces, marchés, entrepreneuriat et initiatives locales.", href: "/commune#economie" },
  { icon: "◎", title: "Sport & culture", text: "Équipements, événements et vie associative.", href: "/actualites" },
];

const news = [
  {
    tag: "Municipalité",
    date: "2026",
    title: "Kintélé renforce son ambition de ville moderne et connectée",
    text: "Le portail municipal s’inscrit dans une démarche de proximité et de modernisation des services rendus aux habitants.",
  },
  {
    tag: "Territoire",
    date: "2024–2026",
    title: "Kintélé au sein du département de Brazzaville",
    text: "La commune est désormais rattachée au département de Brazzaville dans le cadre de la nouvelle organisation territoriale.",
  },
  {
    tag: "Cadre de vie",
    date: "À découvrir",
    title: "Un territoire entre fleuve, université et grands équipements",
    text: "Kintélé s’appuie sur des infrastructures sportives, universitaires et routières qui structurent son développement.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero-media" aria-hidden="true" />
        <div className="hero-overlay" />
        <div className="container hero-content">
          <span className="eyebrow light">Portail municipal de Kintélé</span>
          <h1>Votre mairie,<br />plus proche de vous.</h1>
          <p>
            Démarches, informations pratiques, actualités et services municipaux :
            retrouvez l’essentiel en quelques clics.
          </p>
          <div className="hero-actions">
            <Link href="/demarches" className="button button-primary">Faire une démarche</Link>
            <Link href="/contact" className="button button-glass">Contacter la mairie</Link>
          </div>
        </div>
      </section>

      <section className="quick-search" aria-label="Recherche rapide">
        <div className="container search-panel">
          <div>
            <span className="eyebrow">Que recherchez-vous ?</span>
            <h2>Accédez rapidement à votre service</h2>
          </div>
          <form className="search-box" action="/demarches">
            <input name="q" aria-label="Rechercher une démarche" placeholder="Ex. acte de naissance, légalisation, urbanisme…" />
            <button type="submit">Rechercher</button>
          </form>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading split">
            <div>
              <span className="eyebrow">Services municipaux</span>
              <h2>Les démarches du quotidien</h2>
            </div>
            <Link href="/demarches" className="text-link">Voir toutes les démarches →</Link>
          </div>
          <div className="service-grid">
            {services.map((service) => (
              <Link className="service-card" href={service.href} key={service.title}>
                <span className="service-icon">{service.icon}</span>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <span className="card-arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mayor-section">
        <div className="container mayor-grid">
          <div className="mayor-copy">
            <span className="eyebrow light">La commune</span>
            <h2>Kintélé, une ville en mouvement</h2>
            <p className="lead">
              Commune de la périphérie nord-est de Brazzaville, Kintélé rassemble environ
              71&nbsp;629 habitants et poursuit son développement autour de l’éducation,
              du sport, des mobilités et du cadre de vie.
            </p>
            <div className="stat-row">
              <div><strong>71 629</strong><span>habitants</span></div>
              <div><strong>25</strong><span>sièges municipaux</span></div>
              <div><strong>2017</strong><span>commune à part entière</span></div>
            </div>
            <Link href="/commune" className="button button-light">Découvrir la commune</Link>
          </div>
          <div className="mayor-card">
            <span className="card-kicker">Exécutif municipal</span>
            <h3>Stella Mensah<br />Sassou N’Guesso</h3>
            <p>Députée-maire de la commune de Kintélé</p>
            <div className="mayor-rule" />
            <p className="small">Fonction confirmée par des sources publiques récentes de 2026.</p>
          </div>
        </div>
      </section>

      <section className="territory-section">
        <div className="territory-image" role="img" aria-label="Campus universitaire à Kintélé" />
        <div className="territory-card">
          <span className="eyebrow">Territoire</span>
          <h2>Étudier, entreprendre, vivre à Kintélé</h2>
          <p>
            Université Denis Sassou N’Guesso, complexe sportif de la Concorde, viaduc
            Talangaï–Kintélé et nouveaux quartiers : la commune bénéficie d’équipements
            structurants à l’échelle métropolitaine.
          </p>
          <Link href="/commune" className="text-link">Explorer le territoire →</Link>
        </div>
      </section>

      <section className="section news-section">
        <div className="container">
          <div className="section-heading split">
            <div>
              <span className="eyebrow">À la une</span>
              <h2>Actualités de Kintélé</h2>
            </div>
            <Link href="/actualites" className="text-link">Toutes les actualités →</Link>
          </div>
          <div className="news-grid">
            {news.map((item) => (
              <article className="news-card" key={item.title}>
                <div className="news-meta"><span>{item.tag}</span><time>{item.date}</time></div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <Link href="/actualites">Lire la suite →</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-band">
        <div className="container contact-band-inner">
          <div>
            <span className="eyebrow light">Besoin d’aide ?</span>
            <h2>La mairie vous accueille du lundi au vendredi</h2>
            <p>Avenue de l’Université, Kintélé · 8h00–15h30</p>
          </div>
          <Link href="/contact" className="button button-light">Nous contacter</Link>
        </div>
      </section>
    </>
  );
}
