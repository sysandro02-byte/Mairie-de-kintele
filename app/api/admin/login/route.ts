import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function normalizeLoginId(value: unknown) {
  return String(value || "").trim().toLowerCase();
}

export async function POST(request: Request) {
  try {
    const { loginId: rawLoginId, password } = await request.json();
    const loginId = normalizeLoginId(rawLoginId);

    if (!/^[a-z0-9._-]{3,40}$/.test(loginId) || typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { message: "Identifiant ou mot de passe incorrect." },
        { status: 401 }
      );
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !publishableKey || !secretKey) {
      return NextResponse.json(
        { message: "Le service d’authentification administrateur n’est pas encore configuré." },
        { status: 503 }
      );
    }

    const adminClient = createClient(url, secretKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    const { data: account, error: accountError } = await adminClient
      .from("mairie_admin_users")
      .select("email, active")
      .eq("login_id", loginId)
      .maybeSingle();

    if (accountError || !account || !account.active) {
      return NextResponse.json(
        { message: "Identifiant ou mot de passe incorrect, ou compte non autorisé." },
        { status: 401 }
      );
    }

    const authClient = createClient(url, publishableKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    const { data, error } = await authClient.auth.signInWithPassword({
      email: account.email,
      password,
    });

    if (error || !data.session) {
      return NextResponse.json(
        { message: "Identifiant ou mot de passe incorrect." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { message: "La connexion n’a pas pu être traitée." },
      { status: 400 }
    );
  }
}
