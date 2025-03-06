import { Button } from "~/components/ui/button";
import { FaReact } from "react-icons/fa";
import {
  SiTypescript,
  SiTailwindcss,
  SiMongodb,
  SiExpress,
  SiAuth0,
  SiNodedotjs,
  SiAnilist,
} from "react-icons/si";
import { LuGithub } from "react-icons/lu";

export default function About() {
  return (
    <>
      <head>
        <title>About</title>
      </head>
      <div className="py-12 max-w-5xl space-y-8">
        <section className="bg-card/50 p-8 rounded-xl backdrop-blur-sm">
          <h2 className="text-4xl font-semibold mb-6 text-primary">
            Project Overview
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Animadom is a comprehensive anime discovery platform that helps
            users explore, track, and learn about their favorite anime series
            and characters.
          </p>
        </section>

        <section className="bg-card/50 p-8 rounded-xl backdrop-blur-sm">
          <h2 className="text-4xl font-semibold mb-6 text-primary">
            APIs and Data Sources
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-4 bg-card p-6 rounded-xl hover:shadow-xl transition-all border-muted-foreground border">
              <div
                className="text-4xl font-mono font-bold text-primary"
                role="banner"
              >
                J
              </div>
              <div>
                <a
                  href="https://jikan.moe/"
                  className="text-lg font-medium text-primary hover:underline"
                >
                  Jikan API
                </a>
                <p className="text-muted-foreground mt-1 text-sm">
                  The unofficial MyAnimeList API providing comprehensive anime
                  and manga data.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-card p-6 rounded-xl hover:shadow-xl transition-all border-muted-foreground border">
              <SiAnilist className="text-6xl text-[#02A9FF]" />
              <div>
                <a
                  href="https://anilist.co/graphiql"
                  className="text-lg font-medium text-primary hover:underline"
                >
                  AniList API
                </a>
                <p className="text-muted-foreground mt-1 text-sm">
                  GraphQL API for anime and manga data with rich features.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-card/50 p-8 rounded-xl backdrop-blur-sm">
          <h2 className="text-4xl font-semibold mb-6 text-primary">
            Technologies Used
          </h2>
          <div className="flex flex-wrap gap-6">
            {[
              { icon: FaReact, name: "React", color: "#61DAFB" },
              { icon: SiTypescript, name: "TypeScript", color: "#3178C6" },
              { icon: SiTailwindcss, name: "Tailwind CSS", color: "#38B2AC" },
              { icon: SiMongodb, name: "MongoDB", color: "#47A248" },
              { icon: SiExpress, name: "Express", color: "#ffffff" },
              { icon: SiNodedotjs, name: "Node.js", color: "#339933" },
              { icon: SiAuth0, name: "Auth.js", color: "#EB5424" },
            ].map((tech, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center p-6 bg-card rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <tech.icon
                  className={`text-6xl mb-4`}
                  style={{ color: tech.color }}
                />
                <span className="text-center font-medium text-primary">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-4xl font-semibold mb-6 text-primary">
            About the Creator
          </h2>
          <div className="flex flex-col md:flex-row bg-card/50 p-8 rounded-xl backdrop-blur-sm items-center md:items-start">
            <img
              src="https://github.com/haider-9.png"
              alt="Haider"
              className="size-40 rounded-full ring-4 ring-primary"
            />
            <div className="md:ml-8 mt-6 md:mt-0 text-center md:text-left">
              <h3 className="text-2xl font-semibold text-primary">Haider</h3>
              <p className="text-lg mt-2 text-muted-foreground leading-relaxed">
                A passionate full-stack developer with a love for anime and web
                development. This project was created to help anime enthusiasts
                discover and track their favorite shows while showcasing modern
                web development practices.
              </p>
              <div className="mt-4 flex justify-center md:justify-start">
                <a
                  href="https://github.com/haider-9"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 hover:scale-105 transition-transform"
                  >
                    <LuGithub className="text-xl" />
                    <span>GitHub</span>
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}