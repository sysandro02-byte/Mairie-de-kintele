"use client";

import { FormEvent, useMemo, useState } from "react";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "../../../lib/supabase";

export default function AdminSignupPage() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setSuccess(false);

    if (!isSupabaseConfigured() || !supabase) {
      setMessage("L’authentification du backoffice n’est pas encore reliée à Supabase.");
      setLoading(false);
      return;
    }

    const form = new FormData(event.currentTarget);
    const fullName = String(form.get("full_name") || "").trim();
    const loginId = String(form.get("login_id") || "").trim().toLowerCase();
    const email = String(form.get("email") || "").trim().toLowerCase();
    const password = String(form.get("password") || "");
    const confirmation = String(form.get("password_confirmation") || "");

    if (!/^[a-z0-9._-]{3,40}$/.test(loginId)) {
      setMessage("Choisissez un ID de 3 à 40 caractères avec lettres, chiffres, point, tiret ou underscore.");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setMessage("Le mot de passe doit comporter au moins 8 caractères.");
      setLoading(false);
      return;
    }

    if (password !== confirmation) {
      setMessage("Les deux mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          login_id: loginId,
        },
      },
    });

    if (error) {
      const duplicateId = error.message.toLowerCase().includes("database");
      setMessage(
        duplicateId
          ? "Cet ID administrateur est peut-être déjà utilisé. Choisissez un autre identifiant."
          : error.message
      );
      setLoading(false);
      return;
    }

    setSuccess(true);
    setMessage(
      "Compte créé. Si cet e-mail est autorisé pour l’administration, vous pourrez vous connecter avec votre ID et votre mot de passe. Une confirmation e-mail peut être demandée selon la configuration Supabase."
    );
    setLoading(false);
    event.currentTarget.reset();
  }

  return (
    <section className="admin-login-page">
      <div className="admin-login-card admin-signup-card">
        <span className="eyebrow">Création de compte</span>
        <h1>Compte administrateur</h1>
        <p>
          Créez votre compte avec un ID unique. Cet ID sera ensuite utilisé à chaque
          connexion au backoffice.
        </p>

        <form onSubmit={submit}>
          <label>
            <span>Nom et prénom(s)</span>
            <input name="full_name" type="text" autoComplete="name" required />
          </label>

          <label>
            <span>ID administrateur</span>
            <input
              name="login_id"
              type="text"
              autoComplete="username"
              placeholder="Ex. mederic.admin"
              minLength={3}
              maxLength={40}
              pattern="[A-Za-z0-9._-]+"
              required
            />
            <small>3 à 40 caractères : lettres, chiffres, point, tiret ou underscore.</small>
          </label>

          <label>
            <span>E-mail du compte</span>
            <input name="email" type="email" autoComplete="email" required />
            <small>Utilisé pour la création et la récupération du compte.</small>
          </label>

          <label>
            <span>Mot de passe</span>
            <input name="password" type="password" minLength={8} autoComplete="new-password" required />
          </label>

          <label>
            <span>Confirmer le mot de passe</span>
            <input name="password_confirmation" type="password" minLength={8} autoComplete="new-password" required />
          </label>

          {message && (
            <div className={success ? "admin-signup-success" : "admin-login-message"} role="status">
              {message}
            </div>
          )}

          <button className="button button-primary" type="submit" disabled={loading}>
            {loading ? "Création…" : "Créer le compte"}
          </button>
        </form>

        <a className="text-link" href="/admin/login">← J’ai déjà un compte</a>
      </div>
    </section>
  );
}
