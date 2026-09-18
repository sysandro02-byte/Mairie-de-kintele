export default function CommunePage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow light">Ma commune</span>
          <h1>Kintélé</h1>
          <p>Une commune de la métropole brazzavilloise, tournée vers l’éducation, le sport, les mobilités et le développement urbain.</p>
        </div>
      </section>
      <section className="content-section">
        <div className="container two-col">
          <article className="info-card">
            <span className="pill">Repères</span>
            <h2>Un territoire stratégique</h2>
            <p>Kintélé se situe au nord-est de Brazzaville et est reliée à la capitale notamment par le viaduc Talangaï–Kintélé.</p>
            <p>La commune a été érigée en commune à part entière en 2017. Depuis la loi n°29-2024, elle relève du département de Brazzaville.</p>
          </article>
          <article className="info-card">
            <span className="pill">Démographie</span>
            <h2>71 629 habitants</h2>
            <p>Le dernier chiffre officiel largement repris pour Kintélé est de 71 629 habitants, issu du recensement général de la population.</p>
          </article>
          <article className="info-card" id="economie">
            <span className="pill">Équipements</span>
            <h2>Des infrastructures majeures</h2>
            <p>Le complexe sportif de la Concorde, l’Université Denis Sassou N’Guesso, le Grand Hôtel de Kintélé et les axes routiers structurants contribuent au rayonnement de la commune.</p>
          </article>
          <article className="info-card">
            <span className="pill">Municipalité</span>
            <h2>Exécutif local</h2>
            <p>Stella Mensah Sassou N’Guesso est citée en 2026 comme députée-maire de la commune de Kintélé.</p>
            <p>Le conseil municipal compte 25 sièges selon le Journal officiel de 2026.</p>
          </article>
        </div>
      </section>
    </>
  );
}
