import Link from "next/link";
import HeroSlider from "../components/HeroSlider";
import { getHomeContent, getSiteContent } from "../lib/content";

const gallery = [
  {
    src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Images%20de%20paysage%20naturel%20de%20kint%C3%A9l%C3%A9%2001.png",
    title: "Paysages de Kintélé",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Un_soleil_P%C3%A9tillant_au_campus_UDSN_de_kintele.jpg",
    title: "Campus universitaire",
  },
  {
    src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Stade%20de%20la%20concorde%20de%20Kintele.jpg",
    title: "Complexe sportif de la Concorde",
  },
];

export default async function HomePage() {
  const [{ slides, services, news }, content] = await Promise.all([
    getHomeContent(),
    getSiteContent(),
  ]);

  return (
    <>
      <HeroSlider slides={slides.slice(0, 3)} />

      <section className="quick-search" aria-label="Recherche rapide">
        <div className="container search-panel">
          <div>
            <span className="eyebrow">Services en ligne</span>
            <h2>Accédez rapidement à votre service</h2>
          </div>
          <div className="home-online-actions">
            <form className="search-box" action="/demarches">
              <input name="q" aria-label="Rechercher une démarche" placeholder="Ex. acte de naissance, légalisation, urbanisme…" />
              <button type="submit">Rechercher</button>
            </form>
            <Link href="/demande" className="online-request-link">
              <span>Demande de document</span>
              <strong>Commencer en ligne →</strong>
            </Link>
          </div>
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
              <Link className="service-card" href={service.href} key={service.id}>
                <span className="service-icon">{service.icon}</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
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
            <p className="lead">{content["home.city_intro"]}</p>
            <div className="stat-row">
              <div><strong>{content["home.population"]}</strong><span>habitants</span></div>
              <div><strong>{content["home.seats"]}</strong><span>sièges municipaux</span></div>
              <div><strong>{content["home.commune_since"]}</strong><span>commune à part entière</span></div>
            </div>
            <Link href="/commune" className="button button-light">Découvrir la commune</Link>
          </div>

          <div className="mayor-card">
            <span className="card-kicker">Exécutif municipal</span>
            <h3>{content["home.mayor_name"]}</h3>
            <p>{content["home.mayor_role"]}</p>
            <div className="mayor-rule" />
            <p className="small">Informations institutionnelles modifiables depuis le backoffice.</p>
          </div>
        </div>
      </section>

      <section className="visual-story-section">
        <div className="container">
          <div className="section-heading split">
            <div>
              <span className="eyebrow">Kintélé en images</span>
              <h2>Un territoire à découvrir</h2>
            </div>
            <Link href="/commune" className="text-link">Découvrir la commune →</Link>
          </div>
          <div className="visual-story-grid">
            {gallery.map((item, index) => (
              <figure className={`visual-story-card visual-story-card-${index + 1}`} key={item.title}>
                <img src={item.src} alt={item.title} loading="lazy" />
                <figcaption>{item.title}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="territory-section">
        <div className="territory-image" role="img" aria-label="Campus universitaire à Kintélé" />
        <div className="territory-card">
          <span className="eyebrow">Territoire</span>
          <h2>{content["home.territory_title"]}</h2>
          <p>{content["home.territory_text"]}</p>
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
            {news.slice(0, 3).map((item) => (
              <article className="news-card news-card-rich" key={item.id}>
                {item.image_url && <img src={item.image_url} alt="" loading="lazy" />}
                <div className="news-card-body">
                  <div className="news-meta">
                    <span>{item.category}</span>
                    <time>{new Date(item.published_at).toLocaleDateString("fr-FR", { dateStyle: "medium" })}</time>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.excerpt}</p>
                  <Link href="/actualites">Lire la suite →</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="digital-services-band">
        <div className="container digital-services-grid">
          <div>
            <span className="eyebrow light">Mairie en ligne</span>
            <h2>Préparez votre demande avant de vous déplacer</h2>
            <p>
              Envoyez les premières informations en ligne. La mairie vérifie le dossier
              et vous communique ensuite les pièces, frais et modalités applicables.
            </p>
          </div>
          <div className="digital-services-actions">
            <Link href="/demande" className="button button-primary">Faire une demande</Link>
            <Link href="/demarches" className="button button-glass">Voir les documents</Link>
          </div>
        </div>
      </section>

      <section className="contact-band">
        <div className="container contact-band-inner">
          <div>
            <span className="eyebrow light">Besoin d’aide ?</span>
            <h2>La mairie vous accueille du lundi au vendredi</h2>
            <p>{content["contact.address"]} · {content["contact.hours"]}</p>
          </div>
          <Link href="/contact" className="button button-light">Nous contacter</Link>
        </div>
      </section>
    </>
  );
}
