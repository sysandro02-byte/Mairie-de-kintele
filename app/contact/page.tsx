import { getSiteContent } from "../../lib/content";

export default async function ContactPage() {
  const content = await getSiteContent();

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow light">Nous contacter</span>
          <h1>La mairie à votre écoute</h1>
          <p>Préparez votre venue, identifiez le bon service et retrouvez les informations pratiques de l’Hôtel de Ville.</p>
        </div>
      </section>

      <section className="content-section">
        <div className="container contact-grid">
          <div className="stack">
            <article className="info-card">
              <span className="pill">Hôtel de Ville</span>
              <h2>Mairie de Kintélé</h2>
              <p><strong>Adresse</strong><br />{content["contact.address"]}</p>
              <p><strong>Horaires</strong><br />{content["contact.hours"]}</p>
              <p>
                <strong>E-mail</strong><br />
                <a className="text-link" href={`mailto:${content["contact.email"]}`}>{content["contact.email"]}</a>
              </p>
            </article>

            <article className="contact-photo-card">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/c/ca/Un_soleil_P%C3%A9tillant_au_campus_UDSN_de_kintele.jpg"
                alt="Kintélé"
                loading="lazy"
              />
            </article>
          </div>

          <article className="info-card">
            <span className="pill">Orientation</span>
            <h2>Quel service recherchez-vous ?</h2>
            <div className="stack">
              <p><strong>État civil</strong><br />Naissance, mariage, décès, légalisation.</p>
              <p><strong>Urbanisme</strong><br />Projets, occupation du domaine public et renseignements.</p>
              <p><strong>Vie locale</strong><br />Associations, événements, initiatives citoyennes et informations municipales.</p>
              <p><strong>Secrétariat municipal</strong><br />Courriers, rendez-vous et orientation générale.</p>
            </div>
            <a className="button button-primary" href={`mailto:${content["contact.email"]}`}>Écrire à la mairie</a>
            <a className="button admin-view-site contact-request-cta" href="/demande">Faire une demande de document</a>
          </article>
        </div>
      </section>
    </>
  );
}
