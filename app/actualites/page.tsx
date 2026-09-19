import { getHomeContent } from "../../lib/content";

export default async function ActualitesPage() {
  const { news } = await getHomeContent();

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow light">Information municipale</span>
          <h1>Actualités</h1>
          <p>Les informations, projets et rendez-vous qui font vivre la commune de Kintélé.</p>
        </div>
      </section>

      <section className="content-section">
        <div className="container news-list-rich">
          {news.map((article) => (
            <article className="news-list-item" key={article.id}>
              {article.image_url && <img src={article.image_url} alt="" loading="lazy" />}
              <div>
                <div className="article-meta">
                  {article.category} · {new Date(article.published_at).toLocaleDateString("fr-FR", { dateStyle: "long" })}
                </div>
                <h2>{article.title}</h2>
                <p>{article.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
