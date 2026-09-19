import { getSupabasePublicClient } from "./supabase";

export type HeroSlide = {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  button_label: string;
  button_href: string;
  sort_order: number;
  active: boolean;
};

export type MunicipalService = {
  id: string;
  icon: string;
  title: string;
  description: string;
  href: string;
  sort_order: number;
  active: boolean;
};

export type NewsItem = {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  image_url: string | null;
  published_at: string;
  published: boolean;
};

export type DocumentType = {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  fee_text: string;
  processing_time: string;
  sort_order: number;
  active: boolean;
};

const commons = (file: string) =>
  `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(file)}`;

export const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: "viaduc",
    title: "Votre mairie, plus proche de vous.",
    subtitle:
      "Démarches, informations pratiques, actualités et services municipaux : l’essentiel de Kintélé en quelques clics.",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/6/65/Viaduc_de_Talanga%C3%AF_%C3%A0_Brazzaville_donnant_acc%C3%A8s_%C3%A0_l%27entr%C3%A9_de_la_ville_et_%C3%A0_la_sortie_de_la_commune_de_kint%C3%A9l%C3%A9_pool_Nord.jpg",
    button_label: "Faire une démarche",
    button_href: "/demarches",
    sort_order: 1,
    active: true,
  },
  {
    id: "campus",
    title: "Une commune qui investit dans l’avenir.",
    subtitle:
      "Kintélé se développe autour de l’éducation, du sport, de la mobilité et de nouveaux services de proximité.",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/c/ca/Un_soleil_P%C3%A9tillant_au_campus_UDSN_de_kintele.jpg",
    button_label: "Découvrir Kintélé",
    button_href: "/commune",
    sort_order: 2,
    active: true,
  },
  {
    id: "stade",
    title: "Kintélé, territoire de grands équipements.",
    subtitle:
      "Le complexe sportif de la Concorde et les infrastructures métropolitaines participent au rayonnement de la commune.",
    image_url: commons("Stade de la concorde de Kintele.jpg"),
    button_label: "Voir les actualités",
    button_href: "/actualites",
    sort_order: 3,
    active: true,
  },
];

export const DEFAULT_SERVICES: MunicipalService[] = [
  { id: "etat-civil", icon: "◉", title: "État civil", description: "Naissance, mariage, décès, légalisation et certification.", href: "/demarches#documents", sort_order: 1, active: true },
  { id: "urbanisme", icon: "⌂", title: "Urbanisme", description: "Renseignements, projets, autorisations et accompagnement.", href: "/demarches#urbanisme", sort_order: 2, active: true },
  { id: "famille", icon: "✦", title: "Famille & jeunesse", description: "Orientation vers les services municipaux et de proximité.", href: "/demarches#famille", sort_order: 3, active: true },
  { id: "citoyennete", icon: "⚑", title: "Vie citoyenne", description: "Informations municipales, participation et rendez-vous.", href: "/demarches#citoyennete", sort_order: 4, active: true },
  { id: "economie", icon: "♟", title: "Économie locale", description: "Commerces, marchés, entrepreneuriat et initiatives locales.", href: "/commune#economie", sort_order: 5, active: true },
  { id: "sport", icon: "◎", title: "Sport & culture", description: "Équipements, événements et vie associative.", href: "/actualites", sort_order: 6, active: true },
];

export const DEFAULT_DOCUMENT_TYPES: DocumentType[] = [
  {
    id: "acte-naissance",
    title: "Copie / extrait d’acte de naissance",
    description: "Demandez une copie ou un extrait d’un acte de naissance enregistré à Kintélé.",
    requirements: ["Pièce d’identité du demandeur", "Informations d’état civil de la personne concernée"],
    fee_text: "Tarif à confirmer par le service d’état civil",
    processing_time: "Délai communiqué après vérification du dossier",
    sort_order: 1,
    active: true,
  },
  {
    id: "acte-mariage",
    title: "Copie / extrait d’acte de mariage",
    description: "Demandez un document relatif à un mariage enregistré auprès de la mairie.",
    requirements: ["Pièce d’identité", "Noms des époux", "Date ou année du mariage"],
    fee_text: "Tarif à confirmer par le service d’état civil",
    processing_time: "Selon disponibilité du registre",
    sort_order: 2,
    active: true,
  },
  {
    id: "acte-deces",
    title: "Copie / extrait d’acte de décès",
    description: "Demandez une copie ou un extrait d’un acte de décès enregistré à Kintélé.",
    requirements: ["Pièce d’identité du demandeur", "Nom de la personne décédée", "Date approximative du décès"],
    fee_text: "Tarif à confirmer par le service d’état civil",
    processing_time: "Selon disponibilité du registre",
    sort_order: 3,
    active: true,
  },
  {
    id: "legalisation",
    title: "Légalisation / certification",
    description: "Préparez une demande de légalisation ou de certification de document.",
    requirements: ["Document original", "Pièce d’identité valide"],
    fee_text: "Tarif communiqué par la mairie",
    processing_time: "Selon le type de document",
    sort_order: 4,
    active: true,
  },
];

export const DEFAULT_NEWS: NewsItem[] = [
  {
    id: "modernisation",
    category: "Municipalité",
    title: "Kintélé renforce son ambition de ville moderne et connectée",
    excerpt: "Le portail municipal s’inscrit dans une démarche de proximité et de modernisation des services rendus aux habitants.",
    image_url: commons("Images de paysage naturel de kintélé 01.png"),
    published_at: "2026-09-01T08:00:00.000Z",
    published: true,
  },
  {
    id: "territoire",
    category: "Territoire",
    title: "Kintélé au sein du département de Brazzaville",
    excerpt: "La commune est rattachée au département de Brazzaville dans le cadre de la nouvelle organisation territoriale.",
    image_url: commons("Images de paysage naturel de kintélé 02.png"),
    published_at: "2026-08-20T08:00:00.000Z",
    published: true,
  },
  {
    id: "equipements",
    category: "Cadre de vie",
    title: "Un territoire entre université, sport et grands équipements",
    excerpt: "Kintélé s’appuie sur des infrastructures universitaires, sportives et routières qui structurent son développement.",
    image_url: commons("Stade de la concorde de Kintele.jpg"),
    published_at: "2026-08-10T08:00:00.000Z",
    published: true,
  },
];

async function safeQuery<T>(query: PromiseLike<{ data: T[] | null; error: unknown }>, fallback: T[]) {
  try {
    const { data, error } = await query;
    if (error || !data || data.length === 0) return fallback;
    return data;
  } catch {
    return fallback;
  }
}

export async function getHomeContent() {
  const supabase = getSupabasePublicClient();
  if (!supabase) {
    return {
      slides: DEFAULT_SLIDES,
      services: DEFAULT_SERVICES,
      news: DEFAULT_NEWS,
    };
  }

  const [slides, services, news] = await Promise.all([
    safeQuery(
      supabase.from("hero_slides").select("*").eq("active", true).order("sort_order"),
      DEFAULT_SLIDES
    ),
    safeQuery(
      supabase.from("services").select("*").eq("active", true).order("sort_order"),
      DEFAULT_SERVICES
    ),
    safeQuery(
      supabase.from("news").select("*").eq("published", true).order("published_at", { ascending: false }).limit(6),
      DEFAULT_NEWS
    ),
  ]);

  return { slides, services, news };
}

export async function getDocumentTypes() {
  const supabase = getSupabasePublicClient();
  if (!supabase) return DEFAULT_DOCUMENT_TYPES;
  return safeQuery(
    supabase.from("document_types").select("*").eq("active", true).order("sort_order"),
    DEFAULT_DOCUMENT_TYPES
  );
}
