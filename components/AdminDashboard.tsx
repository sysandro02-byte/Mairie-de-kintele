"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "../lib/supabase";

type Row = Record<string, any>;

const tabs = [
  ["overview", "Tableau de bord"],
  ["content", "Contenu"],
  ["slides", "Slider"],
  ["services", "Services"],
  ["news", "Actualités"],
  ["documents", "Documents"],
  ["requests", "Demandes"],
  ["media", "Médiathèque"],
] as const;

export default function AdminDashboard() {
  const [tab, setTab] = useState<(typeof tabs)[number][0]>("overview");
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [message, setMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [adminLoginId, setAdminLoginId] = useState("");
  const [slides, setSlides] = useState<Row[]>([]);
  const [services, setServices] = useState<Row[]>([]);
  const [news, setNews] = useState<Row[]>([]);
  const [documents, setDocuments] = useState<Row[]>([]);
  const [requests, setRequests] = useState<Row[]>([]);
  const [content, setContent] = useState<Row[]>([]);
  const [media, setMedia] = useState<Row[]>([]);
  const [uploading, setUploading] = useState(false);

  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  async function loadAll() {
    if (!supabase) return;
    const [
      slidesRes,
      servicesRes,
      newsRes,
      docsRes,
      requestsRes,
      contentRes,
      mediaRes,
    ] = await Promise.all([
      supabase.from("hero_slides").select("*").order("sort_order"),
      supabase.from("services").select("*").order("sort_order"),
      supabase.from("news").select("*").order("published_at", { ascending: false }),
      supabase.from("document_types").select("*").order("sort_order"),
      supabase.from("document_requests").select("*, document_types(title)").order("created_at", { ascending: false }),
      supabase.from("site_content").select("*").order("group_name").order("label"),
      supabase.from("media_library").select("*").order("created_at", { ascending: false }),
    ]);
    setSlides(slidesRes.data || []);
    setServices(servicesRes.data || []);
    setNews(newsRes.data || []);
    setDocuments(docsRes.data || []);
    setRequests(requestsRes.data || []);
    setContent(contentRes.data || []);
    setMedia(mediaRes.data || []);
  }

  useEffect(() => {
    async function bootstrap() {
      if (!isSupabaseConfigured() || !supabase) {
        setMessage("Supabase n’est pas encore configuré pour ce site.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        window.location.href = "/admin/login";
        return;
      }

      setUserEmail(data.user.email || "");
      const { data: admin } = await supabase
        .from("admin_users")
        .select("id, active, login_id")
        .eq("user_id", data.user.id)
        .eq("active", true)
        .maybeSingle();

      if (!admin) {
        setMessage("Ce compte n’est pas autorisé à administrer le portail.");
        setLoading(false);
        return;
      }

      setAdminLoginId(admin.login_id || "");
      setAuthorized(true);
      await loadAll();
      setLoading(false);
    }
    bootstrap();
  }, [supabase]);

  async function saveRow(table: string, row: Row, transform?: (value: Row) => Row) {
    if (!supabase) return;
    setMessage("");
    const payload = transform ? transform(row) : row;
    const id = row.id;
    const { id: _id, created_at: _created, updated_at: _updated, document_types: _joined, ...values } = payload;
    const { error } = await supabase.from(table).update(values).eq("id", id);
    setMessage(error ? `Erreur : ${error.message}` : "Modifications enregistrées.");
    if (!error) await loadAll();
  }

  async function addRow(table: string, payload: Row) {
    if (!supabase) return;
    const { error } = await supabase.from(table).insert(payload);
    setMessage(error ? `Erreur : ${error.message}` : "Élément ajouté.");
    if (!error) await loadAll();
  }

  async function deleteRow(table: string, id: string) {
    if (!supabase || !window.confirm("Supprimer définitivement cet élément ?")) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    setMessage(error ? `Erreur : ${error.message}` : "Élément supprimé.");
    if (!error) await loadAll();
  }

  async function saveContent(row: Row) {
    if (!supabase) return;
    const { error } = await supabase
      .from("site_content")
      .upsert({
        key: row.key,
        label: row.label,
        value: row.value,
        group_name: row.group_name,
      });
    setMessage(error ? `Erreur : ${error.message}` : "Contenu mis à jour.");
    if (!error) await loadAll();
  }

  async function uploadMedia(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !supabase) return;
    setUploading(true);
    setMessage("");

    const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
    const path = `${Date.now()}-${safeName}`;
    const { error: uploadError } = await supabase.storage.from("site-media").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (uploadError) {
      setMessage(`Erreur d’envoi : ${uploadError.message}`);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("site-media").getPublicUrl(path);
    await supabase.from("media_library").insert({
      name: file.name,
      url: data.publicUrl,
      alt_text: file.name.replace(/\.[^.]+$/, ""),
      category: "site",
    });
    setUploading(false);
    setMessage("Image ajoutée à la médiathèque.");
    await loadAll();
  }

  async function logout() {
    await supabase?.auth.signOut();
    window.location.href = "/admin/login";
  }

  if (loading) {
    return <div className="admin-loading">Chargement du backoffice…</div>;
  }

  if (!authorized) {
    return (
      <div className="admin-auth-error">
        <h1>Accès au backoffice</h1>
        <p>{message}</p>
        <a className="button button-primary" href="/admin/login">Se connecter</a>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div>
          <span className="admin-kicker">Administration</span>
          <h1>Mairie de Kintélé</h1>
          {adminLoginId && <p><strong>ID :</strong> {adminLoginId}</p>}
          <p>{userEmail}</p>
        </div>
        <nav>
          {tabs.map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={tab === value ? "is-active" : ""}
              onClick={() => setTab(value)}
            >
              {label}
            </button>
          ))}
        </nav>
        <button type="button" className="admin-logout" onClick={logout}>Déconnexion</button>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <div>
            <span className="eyebrow">Backoffice municipal</span>
            <h2>{tabs.find(([value]) => value === tab)?.[1]}</h2>
          </div>
          <a className="button admin-view-site" href="/" target="_blank" rel="noreferrer">
            Voir le site ↗
          </a>
        </div>

        {message && <div className="admin-message">{message}</div>}

        {tab === "overview" && (
          <section className="admin-dashboard-grid">
            <Metric label="Demandes reçues" value={requests.length} />
            <Metric label="Demandes nouvelles" value={requests.filter((item) => item.status === "nouvelle").length} />
            <Metric label="Actualités" value={news.length} />
            <Metric label="Documents proposés" value={documents.length} />
            <div className="admin-panel admin-panel-wide">
              <h3>Dernières demandes</h3>
              <RequestTable rows={requests.slice(0, 6)} compact />
            </div>
          </section>
        )}

        {tab === "content" && (
          <section className="admin-stack">
            <div className="admin-panel">
              <h3>Textes et informations du site</h3>
              <p className="admin-help">Modifiez les textes généraux, coordonnées, chiffres clés et messages institutionnels.</p>
              <div className="admin-list">
                {content.map((row, index) => (
                  <div className="admin-editor-row" key={row.key}>
                    <label>
                      <span>{row.label || row.key}</span>
                      <textarea
                        value={row.value || ""}
                        onChange={(e) => setContent((items) => items.map((item, i) => i === index ? { ...item, value: e.target.value } : item))}
                        rows={3}
                      />
                    </label>
                    <button className="admin-save" type="button" onClick={() => saveContent(row)}>Enregistrer</button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {tab === "slides" && (
          <section className="admin-stack">
            <div className="admin-section-actions">
              <p>Le slider public affiche les slides actives dans l’ordre défini.</p>
              <button type="button" className="button button-primary" onClick={() => addRow("hero_slides", {
                title: "Nouvelle mise en avant",
                subtitle: "Ajoutez votre texte ici.",
                image_url: "",
                button_label: "En savoir plus",
                button_href: "/",
                sort_order: slides.length + 1,
                active: true,
              })}>+ Ajouter une slide</button>
            </div>
            {slides.map((row, index) => (
              <EditorCard key={row.id} title={row.title || "Slide"} onDelete={() => deleteRow("hero_slides", row.id)}>
                <AdminInput label="Titre" value={row.title || ""} onChange={(value) => updateAt(setSlides, index, "title", value)} />
                <AdminTextarea label="Sous-titre" value={row.subtitle || ""} onChange={(value) => updateAt(setSlides, index, "subtitle", value)} />
                <AdminInput label="URL de l’image" value={row.image_url || ""} onChange={(value) => updateAt(setSlides, index, "image_url", value)} />
                <div className="admin-two-cols">
                  <AdminInput label="Texte du bouton" value={row.button_label || ""} onChange={(value) => updateAt(setSlides, index, "button_label", value)} />
                  <AdminInput label="Lien du bouton" value={row.button_href || ""} onChange={(value) => updateAt(setSlides, index, "button_href", value)} />
                  <AdminInput label="Ordre" type="number" value={String(row.sort_order ?? 0)} onChange={(value) => updateAt(setSlides, index, "sort_order", Number(value))} />
                  <AdminCheckbox label="Visible" checked={Boolean(row.active)} onChange={(value) => updateAt(setSlides, index, "active", value)} />
                </div>
                <button className="admin-save" type="button" onClick={() => saveRow("hero_slides", row)}>Enregistrer</button>
              </EditorCard>
            ))}
          </section>
        )}

        {tab === "services" && (
          <section className="admin-stack">
            <div className="admin-section-actions">
              <p>Gérez les cartes de services visibles sur la page d’accueil.</p>
              <button type="button" className="button button-primary" onClick={() => addRow("services", {
                icon: "•", title: "Nouveau service", description: "", href: "/demarches", sort_order: services.length + 1, active: true,
              })}>+ Ajouter un service</button>
            </div>
            {services.map((row, index) => (
              <EditorCard key={row.id} title={row.title} onDelete={() => deleteRow("services", row.id)}>
                <div className="admin-two-cols">
                  <AdminInput label="Icône" value={row.icon || ""} onChange={(value) => updateAt(setServices, index, "icon", value)} />
                  <AdminInput label="Titre" value={row.title || ""} onChange={(value) => updateAt(setServices, index, "title", value)} />
                </div>
                <AdminTextarea label="Description" value={row.description || ""} onChange={(value) => updateAt(setServices, index, "description", value)} />
                <div className="admin-two-cols">
                  <AdminInput label="Lien" value={row.href || ""} onChange={(value) => updateAt(setServices, index, "href", value)} />
                  <AdminInput label="Ordre" type="number" value={String(row.sort_order ?? 0)} onChange={(value) => updateAt(setServices, index, "sort_order", Number(value))} />
                  <AdminCheckbox label="Visible" checked={Boolean(row.active)} onChange={(value) => updateAt(setServices, index, "active", value)} />
                </div>
                <button className="admin-save" type="button" onClick={() => saveRow("services", row)}>Enregistrer</button>
              </EditorCard>
            ))}
          </section>
        )}

        {tab === "news" && (
          <section className="admin-stack">
            <div className="admin-section-actions">
              <p>Publiez ou retirez des actualités depuis le backoffice.</p>
              <button type="button" className="button button-primary" onClick={() => addRow("news", {
                category: "Municipalité", title: "Nouvelle actualité", excerpt: "", body: "", image_url: "", published: false, published_at: new Date().toISOString(),
              })}>+ Nouvelle actualité</button>
            </div>
            {news.map((row, index) => (
              <EditorCard key={row.id} title={row.title} onDelete={() => deleteRow("news", row.id)}>
                <div className="admin-two-cols">
                  <AdminInput label="Catégorie" value={row.category || ""} onChange={(value) => updateAt(setNews, index, "category", value)} />
                  <AdminInput label="Titre" value={row.title || ""} onChange={(value) => updateAt(setNews, index, "title", value)} />
                </div>
                <AdminTextarea label="Résumé" value={row.excerpt || ""} onChange={(value) => updateAt(setNews, index, "excerpt", value)} />
                <AdminTextarea label="Contenu" value={row.body || ""} onChange={(value) => updateAt(setNews, index, "body", value)} />
                <AdminInput label="URL de l’image" value={row.image_url || ""} onChange={(value) => updateAt(setNews, index, "image_url", value)} />
                <AdminCheckbox label="Publié" checked={Boolean(row.published)} onChange={(value) => updateAt(setNews, index, "published", value)} />
                <button className="admin-save" type="button" onClick={() => saveRow("news", row)}>Enregistrer</button>
              </EditorCard>
            ))}
          </section>
        )}

        {tab === "documents" && (
          <section className="admin-stack">
            <div className="admin-section-actions">
              <p>Définissez les documents que les internautes peuvent demander.</p>
              <button type="button" className="button button-primary" onClick={() => addRow("document_types", {
                title: "Nouveau document", description: "", requirements: [], fee_text: "", processing_time: "", sort_order: documents.length + 1, active: true,
              })}>+ Ajouter un document</button>
            </div>
            {documents.map((row, index) => (
              <EditorCard key={row.id} title={row.title} onDelete={() => deleteRow("document_types", row.id)}>
                <AdminInput label="Nom du document" value={row.title || ""} onChange={(value) => updateAt(setDocuments, index, "title", value)} />
                <AdminTextarea label="Description" value={row.description || ""} onChange={(value) => updateAt(setDocuments, index, "description", value)} />
                <AdminTextarea
                  label="Pièces requises (une par ligne)"
                  value={Array.isArray(row.requirements) ? row.requirements.join("\n") : ""}
                  onChange={(value) => updateAt(setDocuments, index, "requirements", value.split("\n").filter(Boolean))}
                />
                <div className="admin-two-cols">
                  <AdminInput label="Frais / tarif" value={row.fee_text || ""} onChange={(value) => updateAt(setDocuments, index, "fee_text", value)} />
                  <AdminInput label="Délai" value={row.processing_time || ""} onChange={(value) => updateAt(setDocuments, index, "processing_time", value)} />
                  <AdminInput label="Ordre" type="number" value={String(row.sort_order ?? 0)} onChange={(value) => updateAt(setDocuments, index, "sort_order", Number(value))} />
                  <AdminCheckbox label="Disponible en ligne" checked={Boolean(row.active)} onChange={(value) => updateAt(setDocuments, index, "active", value)} />
                </div>
                <button className="admin-save" type="button" onClick={() => saveRow("document_types", row)}>Enregistrer</button>
              </EditorCard>
            ))}
          </section>
        )}

        {tab === "requests" && (
          <section className="admin-panel">
            <h3>Demandes des internautes</h3>
            <RequestTable
              rows={requests}
              onChange={(id, key, value) => setRequests((items) => items.map((item) => item.id === id ? { ...item, [key]: value } : item))}
              onSave={(row) => saveRow("document_requests", row)}
            />
          </section>
        )}

        {tab === "media" && (
          <section className="admin-stack">
            <div className="admin-panel">
              <h3>Médiathèque</h3>
              <p className="admin-help">Ajoutez des images qui pourront être utilisées dans le slider, les actualités ou les pages de la commune.</p>
              <label className="media-upload">
                <span>{uploading ? "Envoi en cours…" : "Choisir une image"}</span>
                <input type="file" accept="image/*" onChange={uploadMedia} disabled={uploading} />
              </label>
            </div>
            <div className="media-grid">
              {media.map((item) => (
                <article className="media-card" key={item.id}>
                  <img src={item.url} alt={item.alt_text || item.name} />
                  <div>
                    <strong>{item.name}</strong>
                    <button type="button" onClick={() => navigator.clipboard.writeText(item.url)}>Copier l’URL</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="admin-metric"><span>{label}</span><strong>{value}</strong></div>;
}

function EditorCard({ title, children, onDelete }: { title: string; children: React.ReactNode; onDelete: () => void }) {
  return (
    <article className="admin-panel">
      <div className="admin-editor-header">
        <h3>{title}</h3>
        <button type="button" className="admin-delete" onClick={onDelete}>Supprimer</button>
      </div>
      <div className="admin-editor-fields">{children}</div>
    </article>
  );
}

function AdminInput({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return <label className="admin-field"><span>{label}</span><input type={type} value={value} onChange={(e) => onChange(e.target.value)} /></label>;
}

function AdminTextarea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="admin-field"><span>{label}</span><textarea value={value} rows={4} onChange={(e) => onChange(e.target.value)} /></label>;
}

function AdminCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <label className="admin-check"><input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} /><span>{label}</span></label>;
}

function updateAt(setter: React.Dispatch<React.SetStateAction<Row[]>>, index: number, key: string, value: any) {
  setter((items) => items.map((item, i) => i === index ? { ...item, [key]: value } : item));
}

function RequestTable({
  rows,
  compact = false,
  onChange,
  onSave,
}: {
  rows: Row[];
  compact?: boolean;
  onChange?: (id: string, key: string, value: any) => void;
  onSave?: (row: Row) => void;
}) {
  if (!rows.length) return <p className="admin-help">Aucune demande pour le moment.</p>;

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Référence</th>
            <th>Demandeur</th>
            <th>Document</th>
            <th>Statut</th>
            {!compact && <th>Contact</th>}
            {!compact && <th>Notes</th>}
            {!compact && <th />}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td><strong>{row.reference}</strong><small>{new Date(row.created_at).toLocaleDateString("fr-FR")}</small></td>
              <td>{row.full_name}</td>
              <td>{row.document_types?.title || "Document municipal"}</td>
              <td>
                {compact ? (
                  <span className={`status-badge status-${row.status}`}>{row.status}</span>
                ) : (
                  <select value={row.status} onChange={(e) => onChange?.(row.id, "status", e.target.value)}>
                    <option value="nouvelle">Nouvelle</option>
                    <option value="en_cours">En cours</option>
                    <option value="a_completer">À compléter</option>
                    <option value="prete">Prête</option>
                    <option value="terminee">Terminée</option>
                    <option value="rejetee">Rejetée</option>
                  </select>
                )}
              </td>
              {!compact && <td><a href={`mailto:${row.email}`}>{row.email}</a><small>{row.phone}</small></td>}
              {!compact && <td><textarea value={row.admin_notes || ""} rows={2} onChange={(e) => onChange?.(row.id, "admin_notes", e.target.value)} /></td>}
              {!compact && <td><button className="admin-save small" type="button" onClick={() => onSave?.(row)}>Mettre à jour</button></td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
