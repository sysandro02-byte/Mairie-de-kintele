export default function SourcesPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow light">Transparence</span>
          <h1>Sources & crédits</h1>
          <p>Les informations factuelles et les visuels utilisés sur ce portail sont documentés ci-dessous.</p>
        </div>
      </section>
      <section className="content-section">
        <div className="container legal-copy">
          <h2>Informations institutionnelles</h2>
          <div className="source-list">
            <a href="https://www.armp.cg/services-masters.php" target="_blank" rel="noreferrer">ARMP Congo — Conseil municipal de Kintélé et adresse mairie@kintele.cg</a>
            <a href="https://sgg.cg/JO/2026/congo-jo-2026-8.pdf" target="_blank" rel="noreferrer">Journal officiel de la République du Congo — répartition des sièges municipaux, 2026</a>
            <a href="https://archive.gazettes.africa/archive/cg/2024/cg-journal-officiel-dated-2024-10-17-no-42.pdf" target="_blank" rel="noreferrer">Loi n°29-2024 — rattachement de Kintélé au département de Brazzaville</a>
            <a href="https://www.adiac-congo.com/content/consolidation-de-la-paix-la-mairie-de-kintele-initie-des-journees-de-priere-en-faveur-de-la" target="_blank" rel="noreferrer">Les Dépêches de Brazzaville — fonction de la députée-maire, février 2026</a>
            <a href="https://xn--communedekintl-nkbb.com/" target="_blank" rel="noreferrer">Portail communal existant — informations pratiques publiées</a>
          </div>
          <h2>Visuels libres</h2>
          <p>Les photographies de territoire proviennent de Wikimedia Commons. Les visuels utilisés sont sous licence libre ou CC0 selon leur fiche respective.</p>
          <div className="source-list">
            <a href="https://commons.wikimedia.org/wiki/File:Un_soleil_P%C3%A9tillant_au_campus_UDSN_de_kintele.jpg" target="_blank" rel="noreferrer">Campus UDSN de Kintélé — Prudel7, CC0</a>
            <a href="https://commons.wikimedia.org/wiki/File:Viaduc_de_Talanga%C3%AF_%C3%A0_Brazzaville_donnant_acc%C3%A8s_%C3%A0_l%27entr%C3%A9_de_la_ville_et_%C3%A0_la_sortie_de_la_commune_de_kint%C3%A9l%C3%A9_pool_Nord.jpg" target="_blank" rel="noreferrer">Viaduc Talangaï–Kintélé — BOKOBA veroly, CC0</a>
          </div>
          <h2>Conception</h2>
          <p>La structure de navigation reprend des bonnes pratiques observées sur des portails municipaux comme ceux de la Ville de Paris : accès direct aux démarches, actualités, services et informations de proximité. Aucun code propriétaire parisien n’a été copié.</p>
        </div>
      </section>
    </>
  );
}
