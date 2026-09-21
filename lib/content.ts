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

async function safeQuery<T>(
  query: PromiseLike<{ data: T[] | null; error: unknown }>,
  fallback: T[]
): Promise<T[]> {
  try {
    const { data, error } = await query;
    if (error || !data || data.length === 0) return fallback;
    return data;
  } catch {
    return fallback;
  }
}

export async function getHomeContent(): Promise<{
  slides: HeroSlide[];
  services: MunicipalService[];
  news: NewsItem[];
}> {
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
      supabase.from("mairie_hero_slides").select("*").eq("active", true).order("sort_order"),
      DEFAULT_SLIDES
    ),
    safeQuery(
      supabase.from("mairie_services").select("*").eq("active", true).order("sort_order"),
      DEFAULT_SERVICES
    ),
    safeQuery(
      supabase.from("mairie_news").select("*").eq("published", true).order("published_at", { ascending: false }).limit(6),
      DEFAULT_NEWS
    ),
  ]);

  return { slides, services, news };
}

export async function getDocumentTypes(): Promise<DocumentType[]> {
  const supabase = getSupabasePublicClient();
  if (!supabase) return DEFAULT_DOCUMENT_TYPES;
  return safeQuery(
    supabase.from("mairie_document_types").select("*").eq("active", true).order("sort_order"),
    DEFAULT_DOCUMENT_TYPES
  );
}


export const DEFAULT_SITE_CONTENT: Record<string, string> = {
  "home.city_intro": "Commune de la périphérie nord-est de Brazzaville, Kintélé rassemble environ 71 629 habitants et poursuit son développement autour de l’éducation, du sport, des mobilités et du cadre de vie.",
  "home.population": "71 629",
  "home.seats": "25",
  "home.commune_since": "2017",
  "home.mayor_name": "Stella Mensah Sassou N’Guesso",
  "home.mayor_role": "Députée-maire de la commune de Kintélé",
  "home.territory_title": "Étudier, entreprendre, vivre à Kintélé",
  "home.territory_text": "Université Denis Sassou N’Guesso, complexe sportif de la Concorde, viaduc Talangaï–Kintélé et nouveaux quartiers : la commune bénéficie d’équipements structurants à l’échelle métropolitaine.",
  "commune.intro": "Une commune de la métropole brazzavilloise, tournée vers l’éducation, le sport, les mobilités et le développement urbain.",
  "commune.history": "Kintélé se situe au nord-est de Brazzaville et est reliée à la capitale notamment par le viaduc Talangaï–Kintélé. La commune a été érigée en commune à part entière en 2017 et relève du département de Brazzaville.",
  "commune.equipment": "Le complexe sportif de la Concorde, l’Université Denis Sassou N’Guesso, le Grand Hôtel de Kintélé et les axes routiers structurants contribuent au rayonnement de la commune.",
  "contact.address": "Avenue de l’Université, Kintélé, République du Congo",
  "contact.hours": "Du lundi au vendredi · 8h00–15h30",
  "contact.email": "mairie@kintele.cg",
};

export async function getSiteContent(): Promise<Record<string, string>> {
  const supabase = getSupabasePublicClient();
  if (!supabase) return DEFAULT_SITE_CONTENT;

  try {
    const { data, error } = await supabase.from("mairie_site_content").select("key, value");
    if (error || !data) return DEFAULT_SITE_CONTENT;
    return data.reduce<Record<string, string>>(
      (acc, item) => {
        acc[item.key] = item.value ?? "";
        return acc;
      },
      { ...DEFAULT_SITE_CONTENT }
    );
  } catch {
    return DEFAULT_SITE_CONTENT;
  }
}
