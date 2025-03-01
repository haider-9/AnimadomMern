import type { Route } from "./+types/_index";
import Carousel from "~/components/carousel";
import TrendingAnime from "~/components/trendinganime";

import Toprated from "~/components/top-rated";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Animadom" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <>
      <main>
      
        <Carousel />
        <TrendingAnime />
        <Toprated />
      </main>
    </>
  );
}
