"use client";

import { FormEvent, useMemo, useState } from "react";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "../lib/supabase";
import type { DocumentType } from "../lib/content";

type Props = {
  documents: DocumentType[];
  initialDocumentId?: string;
};

function createReference() {
  const randomPart =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()
      : Math.random().toString(36).slice(2, 10).toUpperCase();
  return `KIN-${new Date().getFullYear()}-${randomPart}`;
}

export default function DocumentRequestForm({ documents, initialDocumentId }: Props) {
  const [loading, setLoading] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const initialValue = useMemo(
    () => documents.some((doc) => doc.id === initialDocumentId) ? initialDocumentId : documents[0]?.id,
    [documents, initialDocumentId]
  );

  async function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    if (!isSupabaseConfigured()) {
      setErrorMessage("Le service de demande en ligne est en cours d’activation. Merci de réessayer prochainement.");
      setLoading(false);
      return;
    }

    const form = new FormData(event.currentTarget);
    const requestReference = createReference();
    const supabase = getSupabaseBrowserClient();

    const payload = {
      reference: requestReference,
      document_type_id: String(form.get("document_type_id") || ""),
      full_name: String(form.get("full_name") || "").trim(),
      email: String(form.get("email") || "").trim().toLowerCase(),
      phone: String(form.get("phone") || "").trim(),
      address: String(form.get("address") || "").trim(),
      birth_date: String(form.get("birth_date") || "") || null,
      message: String(form.get("message") || "").trim(),
      status: "nouvelle",
    };

    if (!payload.document_type_id || !payload.full_name || !payload.email || !payload.phone) {
      setErrorMessage("Veuillez remplir tous les champs obligatoires.");
      setLoading(false);
      return;
    }

    const { error } = await supabase!.from("mairie_document_requests").insert(payload);
    if (error) {
      setErrorMessage("La demande n’a pas pu être enregistrée. Vérifiez vos informations puis réessayez.");
      setLoading(false);
      return;
    }

    setReference(requestReference);
    setLoading(false);
    event.currentTarget.reset();
  }

  if (reference) {
    return (
      <div className="request-success" role="status">
        <span className="request-success-icon">✓</span>
        <h2>Votre demande a été enregistrée</h2>
        <p>Conservez cette référence pour vos échanges avec la mairie :</p>
        <strong>{reference}</strong>
        <p className="small">
          La mairie vérifiera votre dossier avant de vous indiquer les pièces complémentaires,
          les frais éventuels et les modalités de retrait.
        </p>
      </div>
    );
  }

  return (
    <form className="request-form" onSubmit={submitRequest}>
      <div className="form-grid">
        <label className="form-field form-field-wide">
          <span>Document demandé *</span>
          <select name="document_type_id" defaultValue={initialValue} required>
            {documents.map((doc) => (
              <option value={doc.id} key={doc.id}>{doc.title}</option>
            ))}
          </select>
        </label>

        <label className="form-field">
          <span>Nom et prénom(s) *</span>
          <input name="full_name" type="text" autoComplete="name" required />
        </label>

        <label className="form-field">
          <span>Téléphone *</span>
          <input name="phone" type="tel" autoComplete="tel" placeholder="+242 ..." required />
        </label>

        <label className="form-field">
          <span>Adresse e-mail *</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>

        <label className="form-field">
          <span>Date de naissance</span>
          <input name="birth_date" type="date" />
        </label>

        <label className="form-field form-field-wide">
          <span>Adresse / quartier</span>
          <input name="address" type="text" autoComplete="street-address" />
        </label>

        <label className="form-field form-field-wide">
          <span>Précisions utiles</span>
          <textarea
            name="message"
            rows={5}
            placeholder="Ex. année de l’acte, noms des parents, date du mariage…"
          />
        </label>
      </div>

      <div className="privacy-note">
        Vos informations sont utilisées uniquement pour traiter votre demande auprès de la mairie.
        N’envoyez pas de mot de passe ou de données bancaires dans ce formulaire.
      </div>

      {errorMessage && <div className="form-error" role="alert">{errorMessage}</div>}

      <button className="button button-primary request-submit" type="submit" disabled={loading}>
        {loading ? "Envoi en cours…" : "Envoyer ma demande"}
      </button>
    </form>
  );
}
