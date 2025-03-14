import { Button } from "~/components/ui/button";
import { FaReact, FaGithub } from "react-icons/fa";
import {
  SiTypescript,
  SiTailwindcss,
  SiMongodb,
  SiExpress,
  SiAuth0,
  SiNodedotjs,
  SiAnilist,
  SiVite,
  SiReactrouter,
} from "react-icons/si";
import { LuGithub, LuExternalLink } from "react-icons/lu";
import { motion } from "framer-motion";

export default function About() {
  return (
    <>
      <head>
        <title>About Animadom</title>
        <meta name="description" content="Learn about Animadom - a comprehensive anime discovery platform" />
      </head>
      <div className="py-12 max-w-6xl mx-auto space-y-10 px-4 sm:px-6">
        {/* Project Overview Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-card/50 p-8 rounded-xl backdrop-blur-sm border border-primary/10 shadow-lg"
        >
          <h2 className="text-4xl font-bold mb-6 text-primary bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Project Overview
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Animadom is a comprehensive anime discovery platform that helps
            users explore, track, and learn about their favorite anime series
            and characters. Built with modern web technologies, it provides a seamless
            experience for anime enthusiasts to discover new content and manage their watchlists.
          </p>
        </motion.section>

        {/* APIs and Data Sources Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-card/50 p-8 rounded-xl backdrop-blur-sm border border-primary/10 shadow-lg"
        >
          <h2 className="text-4xl font-bold mb-6 text-primary bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            APIs and Data Sources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-4 bg-card p-6 rounded-xl shadow-md border border-muted-foreground/20">
              <div className="text-4xl font-mono font-bold text-primary bg-primary/10 p-3 rounded-lg">
                J
              </div>
              <div>
                <a
                  href="https://jikan.moe/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-medium text-primary hover:underline flex items-center gap-1"
                >
                  Jikan API <LuExternalLink className="text-sm" />
                </a>
                <p className="text-muted-foreground mt-1 text-sm">
                  The unofficial MyAnimeList API providing comprehensive anime
                  and manga data.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-card p-6 rounded-xl shadow-md border border-muted-foreground/20">
              <SiAnilist className="text-6xl text-[#02A9FF] bg-white/10 p-3 rounded-lg" />
              <div>
                <a
                  href="https://anilist.co/graphiql"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-medium text-primary hover:underline flex items-center gap-1"
                >
                  AniList API <LuExternalLink className="text-sm" />
                </a>
                <p className="text-muted-foreground mt-1 text-sm">
                  GraphQL API for anime and manga data with rich features.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Technologies Used Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-card/50 p-8 rounded-xl backdrop-blur-sm border border-primary/10 shadow-lg"
        >
          <h2 className="text-4xl font-bold mb-6 text-primary bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Technologies Used
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {[
              { icon: FaReact, name: "React", color: "#61DAFB" },
              { icon: SiTypescript, name: "TypeScript", color: "#3178C6" },
              { icon: SiTailwindcss, name: "Tailwind CSS", color: "#38B2AC" },
              { icon: SiMongodb, name: "MongoDB", color: "#47A248" },
              { icon: SiExpress, name: "Express", color: "#ffffff" },
              { icon: SiNodedotjs, name: "Node.js", color: "#339933" },
              { icon: SiAuth0, name: "Auth.js", color: "#EB5424" },
              { icon: SiVite, name: "Vite", color: "#646CFF" },
              { icon: SiReactrouter, name: "React Router", color: "#CA4245" },
            ].map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="flex flex-col items-center justify-center p-6 bg-card rounded-xl shadow-md border border-muted-foreground/20"
              >
                <tech.icon
                  className="text-5xl mb-4"
                  style={{ color: tech.color }}
                />
                <span className="text-center font-medium text-primary">
                  {tech.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* About the Creators Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-4xl font-bold mb-6 text-primary bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            About the Creators
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col bg-card/50 p-8 rounded-xl backdrop-blur-sm border border-primary/10 shadow-lg items-center text-center">
              <img
                src="https://github.com/haider-9.png"
                alt="Haider"
                className="size-40 rounded-full ring-4 ring-primary object-cover mb-4"
              />
              <h3 className="text-2xl font-semibold text-primary">Haider</h3>
              <p className="text-lg mt-2 text-muted-foreground leading-relaxed">
                A passionate full-stack developer with a love for anime and web
                development. This project was created to help anime enthusiasts
                discover and track their favorite shows while showcasing modern
                web development practices.
              </p>
              <div className="mt-4">
                <a
                  href="https://github.com/haider-9"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <LuGithub className="text-xl" />
                    <span>GitHub</span>
                  </Button>
                </a>
              </div>
            </div>
            
            <div className="flex flex-col bg-card/50 p-8 rounded-xl backdrop-blur-sm border border-primary/10 shadow-lg items-center text-center">
              <img
                src="https://github.com/Sharoon166.png"
                alt="Sharoon Shaleem"
                className="size-40 rounded-full ring-4 ring-primary object-cover mb-4"
              />
              <h3 className="text-2xl font-semibold text-primary">Sharoon Shaleem</h3>
              <p className="text-lg mt-2 text-muted-foreground leading-relaxed">
                A talented developer contributing to the Animadom project with expertise
                in frontend development and UI/UX design. Passionate about creating
                intuitive and engaging user experiences for web applications.
              </p>
              <div className="mt-4">
                <a
                  href="https://github.com/Sharoon166"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <LuGithub className="text-xl" />
                    <span>GitHub</span>
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </motion.section>
        
        {/* Contribute Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-card/50 p-8 rounded-xl backdrop-blur-sm border border-primary/10 shadow-lg text-center"
        >
          <h2 className="text-2xl font-bold mb-4 text-primary">Contribute to Animadom</h2>
          <p className="text-muted-foreground mb-6">
            We welcome contributions! Check out our GitHub repository to get involved.
          </p>
          <a
            href="https://github.com/haider-9/AnimadomMern"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button className="flex items-center gap-2 px-6 py-5">
              <FaGithub className="text-xl" />
              <span>View on GitHub</span>
            </Button>
          </a>
        </motion.section>
      </div>
    </>
  );
}