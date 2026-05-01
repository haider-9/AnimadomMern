import { Button } from "~/components/ui/button";
import { FaReact, FaGithub } from "react-icons/fa";
import {
  SiTypescript,
  SiTailwindcss,
  SiMongodb,
  SiExpress,
  SiNodedotjs,
  SiAnilist,
  SiVite,
  SiReactrouter,
} from "react-icons/si";
import { LuGithub, LuExternalLink, LuZap } from "react-icons/lu";
import { motion } from "framer-motion";
import type { Route } from "./+types/about";
import { generateMeta } from "~/lib/seo";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return generateMeta({
    title: "About Animadom",
    description: "Learn about Animadom - a comprehensive anime discovery platform built with modern web technologies. Discover our mission, features, and the technology stack behind the platform.",
    keywords: "about animadom, anime platform, anime discovery, react anime app, anime database",
    url: "/about",
    canonical: "https://animadom.vercel.app/about",
  });
}

export default function About() {
  const techStack = [
    { icon: FaReact, name: "React", color: "#61DAFB" },
    { icon: SiTypescript, name: "TypeScript", color: "#3178C6" },
    { icon: SiTailwindcss, name: "Tailwind", color: "#38B2AC" },
    { icon: SiMongodb, name: "MongoDB", color: "#47A248" },
    { icon: SiExpress, name: "Express", color: "hsl(var(--foreground))" },
    { icon: SiNodedotjs, name: "Node.js", color: "#339933" },
    { icon: SiVite, name: "Vite", color: "#646CFF" },
    { icon: SiReactrouter, name: "React Router", color: "#CA4245" },
  ];

  const apiSources = [
    {
      name: "Jikan API",
      icon: "J",
      url: "https://jikan.moe/",
      description: "Unofficial MyAnimeList API",
      color: "hsl(var(--primary))",
    },
    {
      name: "AniList",
      icon: SiAnilist,
      url: "https://anilist.co/graphiql",
      description: "GraphQL anime database",
      color: "#02A9FF",
    },
    {
      name: "Kitsu API",
      icon: "K",
      url: "https://kitsu.docs.apiary.io/",
      description: "Modern JSON API",
      color: "hsl(var(--primary))",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-40 pt-32">
      {/* Hero Section */}
      <section className="pt-20 container mx-auto px-6 md:px-12">
        <div className="max-w-5xl space-y-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-bebas text-2xl tracking-[0.4em] text-primary mb-6 block uppercase">
              About The Project
            </span>
            <h1 className="text-7xl md:text-[10rem] font-bebas leading-[0.8] uppercase mb-12">
              Your Anime <br />
              <span className="text-primary">Discovery</span> Hub
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl">
              Animadom is a comprehensive anime discovery platform that helps
              enthusiasts explore, track, and learn about their favorite series
              and characters. Built with modern web technologies for a seamless experience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-40 bg-primary text-primary-foreground mt-40">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
            <div className="lg:col-span-5">
              <div className="space-y-8">
                <div className="w-20 h-20 bg-background/20 rounded-3xl flex items-center justify-center rotate-12 hover:rotate-0 transition-all duration-500">
                  <LuZap className="w-10 h-10" />
                </div>
                <h2 className="text-6xl md:text-8xl font-bebas uppercase leading-none">
                  Our <br /> Mission
                </h2>
              </div>
            </div>
            <div className="lg:col-span-7 space-y-12 text-lg md:text-xl text-primary-foreground/70 leading-relaxed">
              <p>
                We believe anime is more than entertainment—it's a cultural phenomenon
                that connects millions worldwide. Our platform is designed to make
                discovery effortless and tracking intuitive.
                <span className="text-primary-foreground block mt-4 font-bold uppercase tracking-widest">
                  Discover. Track. Connect.
                </span>
              </p>
              <p>
                By integrating multiple anime databases and providing a modern,
                responsive interface, we're building the ultimate destination for
                anime enthusiasts to explore their passion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* API Sources Section */}
      <section className="py-40 container mx-auto px-6 md:px-12">
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="font-bebas text-xl tracking-[0.3em] text-primary mb-4 block uppercase">
              Data Sources
            </span>
            <h2 className="text-5xl md:text-7xl font-bebas uppercase leading-none mb-6">
              Powered By The Best APIs
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              We aggregate data from multiple trusted sources to provide comprehensive
              anime information.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {apiSources.map((api, i) => (
            <motion.a
              key={i}
              href={api.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-card p-10 rounded-[48px] border border-border shadow-sm hover:shadow-xl transition-all duration-500 group"
            >
              <div className="flex flex-col items-center text-center space-y-6">
                {typeof api.icon === "string" ? (
                  <div
                    className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl font-bebas"
                    style={{ backgroundColor: `${api.color}20`, color: api.color }}
                  >
                    {api.icon}
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-card rounded-3xl flex items-center justify-center border border-border">
                    <api.icon className="w-12 h-12" style={{ color: api.color }} />
                  </div>
                )}
                <div>
                  <h3 className="font-bebas text-4xl uppercase tracking-wider mb-2 flex items-center justify-center gap-2">
                    {api.name}
                    <LuExternalLink className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-sm text-muted-foreground uppercase tracking-widest">
                    {api.description}
                  </p>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-40 bg-muted/30">
        <div className="container mx-auto px-6 md:px-12">
          <div className="mb-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <span className="font-bebas text-xl tracking-[0.3em] text-primary mb-4 block uppercase">
                Technology Stack
              </span>
              <h2 className="text-5xl md:text-7xl font-bebas uppercase leading-none mb-6">
                Built With Modern Tools
              </h2>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-6">
            {techStack.map((tech, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                className="bg-card p-8 rounded-[32px] border border-border shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center gap-4 group"
              >
                <tech.icon
                  className="text-6xl group-hover:scale-110 transition-transform duration-300"
                  style={{ color: tech.color }}
                />
                <span className="font-bebas text-xl uppercase tracking-wider text-center">
                  {tech.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Creators Section */}
      <section className="py-40 container mx-auto px-6 md:px-12">
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="font-bebas text-xl tracking-[0.3em] text-primary mb-4 block uppercase">
              The Team
            </span>
            <h2 className="text-5xl md:text-7xl font-bebas uppercase leading-none mb-6">
              Meet The Creators
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {[
            {
              name: "Haider",
              github: "haider-9",
              image: "https://github.com/haider-9.png",
              bio: "Full-stack developer passionate about anime and modern web development. Created Animadom to showcase cutting-edge web practices.",
            },
            {
              name: "Sharoon Shaleem",
              github: "Sharoon166",
              image: "https://github.com/Sharoon166.png",
              bio: "Frontend specialist focused on creating intuitive and engaging user experiences. Bringing design excellence to Animadom.",
            },
          ].map((creator, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="bg-card p-12 rounded-[48px] border border-border shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className="flex flex-col items-center text-center space-y-6">
                <img
                  src={creator.image}
                  alt={creator.name}
                  className="w-40 h-40 rounded-full ring-4 ring-primary object-cover"
                />
                <div>
                  <h3 className="font-bebas text-5xl uppercase tracking-wider mb-2">
                    {creator.name}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {creator.bio}
                  </p>
                  <a
                    href={`https://github.com/${creator.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      className="rounded-full px-8 py-6 font-bebas text-xl tracking-wider"
                    >
                      <LuGithub className="mr-2" />
                      GitHub
                    </Button>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-card p-20 rounded-[64px] flex flex-col items-center text-center space-y-12 relative overflow-hidden border border-border shadow-xl"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
          <h2 className="text-6xl md:text-[8rem] font-bebas leading-[0.8] uppercase max-w-4xl">
            Start Your Anime{" "}
            <span className="text-primary">Journey</span> Today
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/">
              <Button className="bg-primary text-primary-foreground px-12 py-7 rounded-full font-bebas text-2xl tracking-widest hover:bg-primary/90 transition-all duration-500 shadow-lg">
                EXPLORE ANIME
              </Button>
            </Link>
            <a
              href="https://github.com/haider-9/AnimadomMern"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                className="px-12 py-7 rounded-full font-bebas text-2xl tracking-widest hover:bg-accent transition-all duration-500"
              >
                <FaGithub className="mr-3" />
                CONTRIBUTE
              </Button>
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
