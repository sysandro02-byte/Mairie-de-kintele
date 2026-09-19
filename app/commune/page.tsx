import { getSiteContent } from "../../lib/content";

export default async function CommunePage() {
  const content = await getSiteContent();

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow light">Ma commune</span>
          <h1>Kintélé</h1>
          <p>{content["commune.intro"]}</p>
        </div>
      </section>

      <section className="commune-feature-image">
        <div className="container">
          <div className="commune-image-card">
            <img
              src="https://commons.wikimedia.org/wiki/Special:Redirect/file/Images%20de%20paysage%20naturel%20de%20kint%C3%A9l%C3%A9%2003.png"
              alt="Paysage de Kintélé"
              loading="lazy"
            />
            <div>
              <span className="eyebrow light">Territoire</span>
              <h2>Une commune entre ville et nature</h2>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="container two-col">
          <article className="info-card">
            <span className="pill">Repères</span>
            <h2>Un territoire stratégique</h2>
            <p>{content["commune.history"]}</p>
          </article>

          <article className="info-card">
            <span className="pill">Démographie</span>
            <h2>{content["home.population"]} habitants</h2>
            <p>Le chiffre affiché sur le portail peut être actualisé directement depuis le backoffice municipal.</p>
          </article>

          <article className="info-card" id="economie">
            <span className="pill">Équipements</span>
            <h2>Des infrastructures majeures</h2>
            <p>{content["commune.equipment"]}</p>
          </article>

          <article className="info-card">
            <span className="pill">Municipalité</span>
            <h2>{content["home.mayor_name"]}</h2>
            <p>{content["home.mayor_role"]}</p>
            <p>Le conseil municipal compte {content["home.seats"]} sièges selon les informations actuellement publiées sur le portail.</p>
          </article>
        </div>
      </section>
    </>
  );
}
