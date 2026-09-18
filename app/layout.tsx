import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Mairie de Kintélé — Portail municipal",
    template: "%s | Mairie de Kintélé",
  },
  description:
    "Portail municipal de Kintélé : démarches administratives, informations pratiques, actualités et services de proximité.",
  metadataBase: new URL("https://mairie-de-kintele.vercel.app"),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>
        <a className="skip-link" href="#contenu">Aller au contenu</a>
        <Header />
        <main id="contenu">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
