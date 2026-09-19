import DocumentRequestForm from "../../components/DocumentRequestForm";
import { getDocumentTypes } from "../../lib/content";

export const metadata = {
  title: "Demande de document",
  description: "Transmettre une demande de document à la Mairie de Kintélé.",
};

export default async function DemandePage({
  searchParams,
}: {
  searchParams: Promise<{ document?: string }>;
}) {
  const params = await searchParams;
  const documents = await getDocumentTypes();

  return (
    <>
      <section className="page-hero request-page-hero">
        <div className="container">
          <span className="eyebrow light">Démarches en ligne</span>
          <h1>Demander un document</h1>
          <p>
            Transmettez votre demande à la mairie. Le service compétent vérifiera
            les informations avant de confirmer les pièces, le tarif éventuel et le retrait.
          </p>
        </div>
      </section>

      <section className="content-section request-section">
        <div className="container request-layout">
          <div>
            <span className="eyebrow">Votre demande</span>
            <h2>Formulaire municipal</h2>
            <DocumentRequestForm documents={documents} initialDocumentId={params.document} />
          </div>
          <aside className="request-aside">
            <div className="request-aside-image" />
            <div className="info-card">
              <span className="pill">Comment ça marche ?</span>
              <ol className="request-steps">
                <li><strong>1.</strong><span>Choisissez le document et remplissez la demande.</span></li>
                <li><strong>2.</strong><span>Vous recevez une référence à conserver.</span></li>
                <li><strong>3.</strong><span>La mairie contrôle les informations transmises.</span></li>
                <li><strong>4.</strong><span>Le service vous indique la suite de la procédure.</span></li>
              </ol>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
