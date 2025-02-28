import type { Route } from "./+types/_index";
import Carousel from "~/components/carousel";

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
      </main>
    </>
  );
}
