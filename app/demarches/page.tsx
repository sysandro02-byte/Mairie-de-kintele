import Link from "next/link";
import { getDocumentTypes } from "../../lib/content";

const groups = [
  {
    id: "urbanisme",
    title: "Urbanisme & habitat",
    items: ["Renseignements sur un projet", "Dépôt d’un dossier", "Orientation vers le service compétent", "Occupation du domaine public"],
  },
  {
    id: "famille",
    title: "Famille, jeunesse & éducation",
    items: ["Orientation scolaire et sociale", "Informations jeunesse", "Vie associative", "Équipements de proximité"],
  },
  {
    id: "citoyennete",
    title: "Citoyenneté & vie locale",
    items: ["Informations municipales", "Rendez-vous en mairie", "Signalement de proximité", "Participation citoyenne"],
  },
];

export default async function DemarchesPage() {
  const documents = await getDocumentTypes();

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow light">Services publics</span>
          <h1>Mes démarches</h1>
          <p>
            Préparez vos démarches, consultez les documents proposés par la mairie
            et transmettez une demande en ligne lorsque le service est disponible.
          </p>
        </div>
      </section>

      <section className="content-section" id="documents">
        <div className="container">
          <div className="section-heading split">
            <div>
              <span className="eyebrow">Documents municipaux</span>
              <h2>Faire une demande en ligne</h2>
            </div>
            <Link className="button button-primary" href="/demande">Nouvelle demande</Link>
          </div>

          <div className="document-grid">
            {documents.map((doc) => (
              <article className="document-card" key={doc.id}>
                <div>
                  <span className="pill">Disponible en ligne</span>
                  <h3>{doc.title}</h3>
                  <p>{doc.description}</p>
                </div>
                <div className="document-details">
                  <strong>Pièces généralement demandées</strong>
                  <ul>
                    {doc.requirements.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                  <p><b>Délai :</b> {doc.processing_time}</p>
                  <p><b>Frais :</b> {doc.fee_text}</p>
                </div>
                <Link className="button document-request-button" href={`/demande?document=${encodeURIComponent(doc.id)}`}>
                  Demander ce document →
                </Link>
              </article>
            ))}
          </div>

          <div className="notice" style={{ marginTop: 30 }}>
            Les pièces, tarifs et délais définitifs sont confirmés par le service municipal après vérification du dossier.
          </div>
        </div>
      </section>

      <section className="section secondary-services-section">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Autres services</span>
            <h2>Être orienté vers le bon service</h2>
          </div>
          <div className="service-grid">
            {groups.map((group) => (
              <article id={group.id} className="info-card" key={group.id}>
                <span className="pill">Service municipal</span>
                <h2>{group.title}</h2>
                <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
