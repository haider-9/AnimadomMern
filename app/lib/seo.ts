import type { MetaDescriptor } from "react-router";
import { APP_CONFIG } from "~/constants";

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  noIndex?: boolean;
  canonical?: string;
}

export function generateMeta({
  title,
  description,
  keywords,
  image = "/logo.png",
  url,
  type = "website",
  noIndex = false,
  canonical,
}: SEOConfig): MetaDescriptor[] {
  const fullTitle = title === APP_CONFIG.NAME ? title : `${title} | ${APP_CONFIG.NAME}`;
  const fullUrl = url ? `${APP_CONFIG.URL}${url}` : APP_CONFIG.URL;
  const fullImageUrl = image.startsWith("http") ? image : `${APP_CONFIG.URL}${image}`;

  const meta: MetaDescriptor[] = [
    { title: fullTitle },
    { name: "description", content: description },
    { name: "viewport", content: "width=device-width, initial-scale=1.0" },
    
    // Open Graph
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: description },
    { property: "og:image", content: fullImageUrl },
    { property: "og:url", content: fullUrl },
    { property: "og:type", content: type },
    { property: "og:site_name", content: APP_CONFIG.NAME },
    { property: "og:locale", content: "en_US" },
    
    // Twitter Card
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: fullTitle },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: fullImageUrl },
    
    // Basic SEO
    { name: "author", content: APP_CONFIG.NAME },
    { name: "robots", content: noIndex ? "noindex, nofollow" : "index, follow" },
    { name: "googlebot", content: noIndex ? "noindex, nofollow" : "index, follow" },
  ];

  // Add keywords if provided
  if (keywords) {
    meta.push({ name: "keywords", content: keywords });
  }

  // Add canonical URL if provided
  if (canonical) {
    meta.push({ tagName: "link", rel: "canonical", href: canonical });
  }

  return meta;
}

export function generateStructuredData(data: any): MetaDescriptor {
  return {
    tagName: "script",
    type: "application/ld+json",
    children: JSON.stringify(data),
  };
}

// Common structured data schemas
export const createOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: APP_CONFIG.NAME,
  url: APP_CONFIG.URL,
  logo: `${APP_CONFIG.URL}/logo.png`,
  description: "The ultimate destination for anime enthusiasts. Explore anime, discover new series, and connect with fellow fans.",
  sameAs: [
    // Add social media URLs here when available
  ],
});

export const createWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: APP_CONFIG.NAME,
  url: APP_CONFIG.URL,
  description: "The ultimate destination for anime enthusiasts. Explore anime, discover new series, and connect with fellow fans.",
  potentialAction: {
    "@type": "SearchAction",
    target: `${APP_CONFIG.URL}/search/{search_term_string}`,
    "query-input": "required name=search_term_string",
  },
});

export const createAnimeSchema = (anime: any) => ({
  "@context": "https://schema.org",
  "@type": "TVSeries",
  name: anime.title?.english || anime.title?.romaji || anime.title,
  description: anime.synopsis || anime.description,
  image: anime.images?.jpg?.large_image_url || anime.coverImage?.large,
  genre: anime.genres?.map((g: any) => g.name) || [],
  aggregateRating: anime.score ? {
    "@type": "AggregateRating",
    ratingValue: anime.score,
    ratingCount: anime.scored_by || anime.popularity,
    bestRating: 10,
    worstRating: 1,
  } : undefined,
  datePublished: anime.aired?.from || anime.startDate,
  productionCompany: anime.studios?.map((s: any) => ({
    "@type": "Organization",
    name: s.name,
  })) || [],
});

export const createCharacterSchema = (character: any) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  name: character.name?.full || character.name,
  description: character.about || character.description,
  image: character.images?.jpg?.image_url || character.image?.large,
  gender: character.gender,
  birthDate: character.birthday,
});

export const createBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: `${APP_CONFIG.URL}${item.url}`,
  })),
});