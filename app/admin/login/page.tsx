"use client";

import { FormEvent, useMemo, useState } from "react";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "../../../lib/supabase";

export default function AdminLoginPage() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    if (!isSupabaseConfigured() || !supabase) {
      setMessage("La base Supabase n’est pas encore reliée au site.");
      setLoading(false);
      return;
    }

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim().toLowerCase();
    const password = String(form.get("password") || "");

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      setMessage(
        error
          ? error.message
          : "Compte créé. Vérifiez votre e-mail si la confirmation est activée, puis connectez-vous."
      );
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage("Connexion impossible. Vérifiez l’adresse e-mail et le mot de passe.");
      setLoading(false);
      return;
    }

    window.location.href = "/admin";
  }

  return (
    <section className="admin-login-page">
      <div className="admin-login-card">
        <span className="eyebrow">Backoffice sécurisé</span>
        <h1>Mairie de Kintélé</h1>
        <p>Connectez-vous pour gérer le contenu du portail municipal et les demandes reçues.</p>

        <form onSubmit={submit}>
          <label>
            <span>Adresse e-mail</span>
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            <span>Mot de passe</span>
            <input
              name="password"
              type="password"
              minLength={8}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              required
            />
          </label>
          {message && <div className="admin-login-message" role="status">{message}</div>}
          <button className="button button-primary" type="submit" disabled={loading}>
            {loading ? "Veuillez patienter…" : mode === "login" ? "Se connecter" : "Créer mon compte"}
          </button>
        </form>

        <button
          className="admin-login-switch"
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setMessage("");
          }}
        >
          {mode === "login"
            ? "Première connexion ? Créer le compte administrateur"
            : "J’ai déjà un compte administrateur"}
        </button>

        <a className="text-link" href="/">← Retour au site</a>
      </div>
    </section>
  );
}
