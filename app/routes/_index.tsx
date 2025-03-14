import type { Route } from "./+types/_index";
import Carousel from "~/components/carousel";
import TrendingAnime from "~/components/trendinganime";
import Toprated from "~/components/top-rated";
import Collections from "~/components/collections";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Animadom" },
    {
      name: "description",
      content:
        "Welcome to Animadom! The ultimate destination for anime enthusiasts. Explore a vast collection of anime, discover new series, and connect with fellow fans. Join us on this thrilling anime journey!",
    },
    {
      name: "keywords",
      content:
        "anime, anime streaming, anime website, anime community, anime streaming website, anime streaming site, anime streaming app, anime streaming online, anime streaming free, anime streaming hd, anime streaming app download, anime streaming app ios, anime streaming app android, anime streaming app iphone, anime streaming app ipad, anime streaming app windows, anime streaming app mac, anime streaming app linux, anime streaming app chrome, anime streaming app firefox, anime streaming app safari, anime streaming app edge, anime streaming app opera, anime streaming app brave, anime streaming app vivaldi, anime streaming app tor, anime streaming app tor browser, anime streaming app tor browser android, anime streaming app tor browser ios, anime streaming app tor browser windows, anime streaming app tor browser mac, anime streaming app tor browser linux, anime streaming app tor browser chrome, anime streaming app tor browser firefox, anime streaming app tor browser safari, anime streaming app tor browser edge, anime streaming app tor browser opera, anime streaming app tor browser brave, anime streaming app tor browser vivaldi, anime streaming app tor browser brave, anime streaming app tor browser vivaldi, anime streaming app tor browser brave vivaldi, anime streaming app tor browser brave vivaldi, anime streaming",
    },
    { name: "author", content: "AnimaDom" },
    { name: "viewport", content: "width=device-width, initial-scale=1.0" },
    { name: "robots", content: "index, follow" },
    { name: "googlebot", content: "index, follow" },
    { rel: "icon", href: "/favicon.png" },
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
      </main>
    </>
  );
}
