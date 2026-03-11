import type { Route } from "./+types/_index";
import Carousel from "~/components/carousel";
import TrendingAnime from "~/components/trendinganime";
import Toprated from "~/components/top-rated";
import Collections from "~/components/collections";
import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import { generateMeta, generateStructuredData, createOrganizationSchema, createWebsiteSchema } from "~/lib/seo";

export function meta({}: Route.MetaArgs) {
  const seoMeta = generateMeta({
    title: "Animadom",
    description: "The ultimate destination for anime enthusiasts. Explore a vast collection of anime, discover new series, and connect with fellow fans. Join us on this thrilling anime journey!",
    keywords: "anime, anime streaming, anime website, anime community, manga, otaku, anime reviews, anime recommendations, trending anime, top anime",
    url: "/",
    canonical: "https://animadom.vercel.app/",
  });

  return [
    ...seoMeta,
    generateStructuredData(createOrganizationSchema()),
    generateStructuredData(createWebsiteSchema()),
  ];
}
export default function Home() {
  return (
    <>
      <main>
        <Carousel />
        <Collections />
        <TrendingAnime />
        <Toprated />
        <Button asChild className="w-full">
          <Link to="/topbyyear">Top Anime by Year & Seasons</Link>
        </Button>{" "}
      </main>
    </>
  );
}
