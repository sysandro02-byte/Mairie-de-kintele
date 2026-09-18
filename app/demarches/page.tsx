const groups = [
  {
    id: "etat-civil",
    title: "État civil",
    items: ["Acte de naissance", "Acte de mariage", "Acte de décès", "Légalisation et certification de documents"],
  },
  {
    id: "urbanisme",
    title: "Urbanisme & habitat",
    items: ["Renseignements sur un projet", "Dépôt d’un dossier", "Orientation vers le service compétent", "Informations sur l’occupation du domaine public"],
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

export default function DemarchesPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow light">Services publics</span>
          <h1>Mes démarches</h1>
          <p>Retrouvez les principales démarches et préparez votre venue à l’Hôtel de Ville de Kintélé.</p>
        </div>
      </section>
      <section className="content-section">
        <div className="container">
          <div className="notice">
            Les procédures et pièces justificatives peuvent évoluer. Avant un déplacement, vérifiez les exigences auprès du service municipal concerné.
          </div>
          <div className="service-grid" style={{ marginTop: 32 }}>
            {groups.map((group) => (
              <article id={group.id} className="info-card" key={group.id}>
                <span className="pill">Service municipal</span>
                <h2>{group.title}</h2>
                <ul>
                  {group.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
