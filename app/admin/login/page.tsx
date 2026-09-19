"use client";

import { FormEvent, useMemo, useState } from "react";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "../../../lib/supabase";

export default function AdminLoginPage() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    if (!isSupabaseConfigured() || !supabase) {
      setMessage("L’authentification du backoffice n’est pas encore reliée à Supabase.");
      setLoading(false);
      return;
    }

    const form = new FormData(event.currentTarget);
    const loginId = String(form.get("login_id") || "").trim().toLowerCase();
    const password = String(form.get("password") || "");

    if (!/^[a-z0-9._-]{3,40}$/.test(loginId)) {
      setMessage("L’identifiant doit contenir entre 3 et 40 caractères : lettres, chiffres, point, tiret ou underscore.");
      setLoading(false);
      return;
    }

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ loginId, password }),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok || !result?.accessToken || !result?.refreshToken) {
      setMessage(result?.message || "Identifiant ou mot de passe incorrect.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.setSession({
      access_token: result.accessToken,
      refresh_token: result.refreshToken,
    });

    if (error) {
      setMessage("La session administrateur n’a pas pu être ouverte.");
      setLoading(false);
      return;
    }

    window.location.href = "/admin";
  }

  return (
    <section className="admin-login-page">
      <div className="admin-login-card">
        <span className="eyebrow">Backoffice sécurisé</span>
        <h1>Connexion administrateur</h1>
        <p>
          Entrez votre identifiant administrateur et votre mot de passe pour accéder
          à la gestion du portail de la Mairie de Kintélé.
        </p>

        <form onSubmit={submit}>
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
          </label>

          <label>
            <span>Mot de passe</span>
            <input
              name="password"
              type="password"
              minLength={8}
              autoComplete="current-password"
              required
            />
          </label>

          {message && <div className="admin-login-message" role="alert">{message}</div>}

          <button className="button button-primary" type="submit" disabled={loading}>
            {loading ? "Connexion…" : "Entrer dans le backoffice"}
          </button>
        </form>

        <div className="admin-account-actions">
          <span>Vous n’avez pas encore de compte ?</span>
          <a className="text-link" href="/admin/inscription">Créer un compte administrateur →</a>
        </div>

        <a className="text-link admin-back-link" href="/">← Retour au site</a>
      </div>
    </section>
  );
}
