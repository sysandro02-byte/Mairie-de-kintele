export default function ContactPage() {
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
              <p><strong>Adresse</strong><br />Avenue de l’Université, Kintélé<br />République du Congo</p>
              <p><strong>Horaires publiés</strong><br />Du lundi au vendredi · 8h00–15h30</p>
              <p><strong>E-mail institutionnel référencé</strong><br /><a className="text-link" href="mailto:mairie@kintele.cg">mairie@kintele.cg</a></p>
            </article>
            <article className="info-card">
              <h3>Avant de vous déplacer</h3>
              <p>Munissez-vous de vos pièces d’identité et des justificatifs nécessaires à votre demande. Les exigences varient selon la démarche.</p>
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
            <a className="button button-primary" href="mailto:mairie@kintele.cg">Écrire à la mairie</a>
          </article>
        </div>
      </section>
    </>
  );
}
