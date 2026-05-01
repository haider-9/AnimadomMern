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
import { LuGithub, LuExternalLink, LuZap, LuDatabase, LuCode} from "react-icons/lu";
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
      description: "MyAnimeList API",
      color: "hsl(var(--primary))",
    },
    {
      name: "AniList",
      icon: SiAnilist,
      url: "https://anilist.co/graphiql",
      description: "GraphQL Database",
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

  const features = [
    {
      icon: LuDatabase,
      title: "Comprehensive Database",
      description: "Access thousands of anime titles with detailed information from multiple sources.",
    },
    {
      icon: LuZap,
      title: "Fast & Responsive",
      description: "Built with modern technologies for lightning-fast performance on all devices.",
    },
    {
      icon: LuCode,
      title: "Open Source",
      description: "Contribute to the project and help make it better for the anime community.",
    },
  ];

  return (
    <div className="min-h-screen pb-16 pt-20">
      {/* Hero Section */}
      <section className="container mx-auto px-6 md:px-12 py-16">
        <div className="max-w-4xl">
          <div className="inline-block px-4 py-1.5 bg-primary/10 rounded-full mb-6">
            <span className="text-sm font-bold uppercase tracking-wider text-primary">
              About The Project
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bebas uppercase mb-6 leading-tight">
            Your Ultimate Anime <br />
            <span className="text-primary">Discovery Platform</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Animadom is a comprehensive anime discovery platform that helps enthusiasts 
            explore, track, and learn about their favorite series and characters. Built 
            with modern web technologies for a seamless experience across all devices.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/">
              <Button size="lg" className="font-bebas text-lg tracking-wider">
                Explore Anime
              </Button>
            </Link>
            <a
              href="https://github.com/haider-9/AnimadomMern"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="outline" className="font-bebas text-lg tracking-wider">
                <FaGithub className="mr-2" />
                View on GitHub
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-card p-6 rounded-2xl border border-border"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bebas text-2xl uppercase mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-primary text-primary-foreground py-16 my-16">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 bg-primary-foreground/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <LuZap className="w-8 h-8" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bebas uppercase mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-primary-foreground/80 leading-relaxed mb-4">
              We believe anime is more than entertainment—it's a cultural phenomenon 
              that connects millions worldwide. Our platform is designed to make 
              discovery effortless and tracking intuitive.
            </p>
            <div className="inline-block px-6 py-2 bg-primary-foreground/10 rounded-full">
              <span className="font-bebas text-lg uppercase tracking-widest">
                Discover • Track • Connect
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* API Sources */}
      <section className="container mx-auto px-6 md:px-12 py-16">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bebas uppercase mb-3">
            Powered By The Best APIs
          </h2>
          <p className="text-muted-foreground">
            We aggregate data from multiple trusted sources for comprehensive information.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {apiSources.map((api, i) => (
            <a
              key={i}
              href={api.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-card p-6 rounded-2xl border border-border hover:border-primary/50 transition-colors group"
            >
              <div className="flex items-start justify-between mb-4">
                {typeof api.icon === "string" ? (
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl font-bebas"
                    style={{ backgroundColor: `${api.color}20`, color: api.color }}
                  >
                    {api.icon}
                  </div>
                ) : (
                  <div className="w-14 h-14 bg-muted rounded-xl flex items-center justify-center">
                    <api.icon className="w-7 h-7" style={{ color: api.color }} />
                  </div>
                )}
                <LuExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h3 className="font-bebas text-2xl uppercase mb-1">
                {api.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {api.description}
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="bg-muted/30 py-16 my-16">
        <div className="container mx-auto px-6 md:px-12">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bebas uppercase mb-3">
              Built With Modern Tools
            </h2>
            <p className="text-muted-foreground">
              Leveraging the latest technologies for optimal performance.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {techStack.map((tech, i) => (
              <div
                key={i}
                className="bg-card p-5 rounded-2xl border border-border flex flex-col items-center justify-center gap-3"
              >
                <tech.icon
                  className="text-5xl"
                  style={{ color: tech.color }}
                />
                <span className="font-bebas text-lg uppercase text-center">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Creators */}
      <section className="container mx-auto px-6 md:px-12 py-16">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bebas uppercase mb-3">
            Meet The Creators
          </h2>
          <p className="text-muted-foreground">
            The team behind Animadom.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              name: "Haider",
              github: "haider-9",
              image: "https://github.com/haider-9.png",
              bio: "Full-stack developer passionate about anime and modern web development.",
            },
            {
              name: "Sharoon Shaleem",
              github: "Sharoon166",
              image: "https://github.com/Sharoon166.png",
              bio: "Frontend specialist focused on creating intuitive user experiences.",
            },
          ].map((creator, i) => (
            <div
              key={i}
              className="bg-card p-6 rounded-2xl border border-border"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={creator.image}
                  alt={creator.name}
                  className="w-20 h-20 rounded-full ring-2 ring-primary object-cover"
                />
                <div>
                  <h3 className="font-bebas text-3xl uppercase">
                    {creator.name}
                  </h3>
                  <a
                    href={`https://github.com/${creator.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                  >
                    <LuGithub className="w-4 h-4" />
                    @{creator.github}
                  </a>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {creator.bio}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 md:px-12 py-16">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-12 rounded-3xl border border-primary/20 text-center">
          <h2 className="text-3xl md:text-5xl font-bebas uppercase mb-4">
            Start Your Anime Journey Today
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of anime fans discovering new series and tracking their favorites.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/">
              <Button size="lg" className="font-bebas text-lg tracking-wider">
                Explore Anime
              </Button>
            </Link>
            <a
              href="https://github.com/haider-9/AnimadomMern"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="outline" className="font-bebas text-lg tracking-wider">
                <FaGithub className="mr-2" />
                Contribute
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
