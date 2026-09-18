const articles = [
  {
    date: "13 juillet 2026",
    category: "Coopération",
    title: "Kintélé poursuit sa dynamique de ville intelligente",
    text: "La commune a annoncé la signature d’une convention d’utilisation de la marque SIIViM, dans le cadre d’une démarche tournée vers l’innovation et la transformation numérique.",
  },
  {
    date: "2026",
    category: "Vie municipale",
    title: "Un nouveau portail pour rapprocher la mairie et les habitants",
    text: "Démarches, informations pratiques et actualités sont réunies dans une interface conçue pour être simple d’accès sur mobile comme sur ordinateur.",
  },
  {
    date: "2024–2026",
    category: "Territoire",
    title: "Kintélé rattachée au département de Brazzaville",
    text: "La loi n°29-2024 a redéfini le ressort territorial du département de Brazzaville en y intégrant la commune de Kintélé.",
  },
];

export default function ActualitesPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow light">Information municipale</span>
          <h1>Actualités</h1>
          <p>Les informations et projets qui font vivre la commune de Kintélé.</p>
        </div>
      </section>
      <section className="content-section">
        <div className="container article-list">
          {articles.map((article) => (
            <article className="article-item" key={article.title}>
              <div className="article-meta">{article.category} · {article.date}</div>
              <h2>{article.title}</h2>
              <p>{article.text}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
