import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router";
import AnimeCard from "~/components/animecard";
import { Button } from "~/components/ui/button";
import { topAnime } from "~/constants";

const watchingAnime = topAnime.filter((anime) =>
  [16498, 21, 44511, 1735].includes(anime.id)
);
const toWatchAnime = topAnime.filter((anime) =>
  [37521, 52347, 918].includes(anime.id)
);
const watchedAnime = topAnime.filter((anime) =>
  [1535, 5114, 269].includes(anime.id)
);

const tabs = [
  { id: "watching", label: "Watching", icon: "👀" },
  { id: "towatch", label: "To Watch", icon: "📝" },
  { id: "watched", label: "Watched", icon: "✅" },
];

const stats = [
  { label: "Total Anime", value: "42" },
  { label: "Days Watched", value: "31.5" },
  { label: "Mean Score", value: "8.2" },
];

export default function Profile() {
  const params = useParams();
  const USER_NAME = params.name;
  const [activeTab, setActiveTab] = useState("watching");

  return (
    <main className="min-h-screen">
      <title>{`Animadom | ${USER_NAME}`}</title>

      <div className="relative h-[40vh] overflow-hidden">
        <img
          src="/banner404.jpg"
          alt=""
          className="absolute w-full h-full object-cover object-center"
          style={{ filter: "brightness(0.6)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900" />
        
        <div className="container mx-auto px-6 h-full flex items-end pb-8 relative z-10">
          <div className="flex items-end gap-6">
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src="https://cdn.myanimelist.net/images/userimages/12345678.jpg"
              alt={`${USER_NAME}'s profile picture`}
              className="w-32 h-32 rounded-full border-4 border-purple-500 shadow-xl"
            />
            <div className="mb-2">
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-4xl font-bold"
              >
                {USER_NAME?.toUpperCase()}
              </motion.h1>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-zinc-400"
              >
                Joined December 2023
              </motion.p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              key={stat.label}
              className="bg-zinc-800/40 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-6"
            >
              <h3 className="text-zinc-400 text-sm">{stat.label}</h3>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <nav className="flex flex-col sm:flex-row gap-3 mb-6 bg-zinc-900/80 p-4 rounded-xl sticky top-0 backdrop-blur-sm z-10 border border-zinc-800/50">
          <div className="grid grid-cols-2 sm:flex sm:flex-row gap-3 w-full">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative group flex items-center justify-center gap-2
                  ${
                    activeTab === tab.id
                      ? "bg-yellow-500/10 text-yellow-500 ring-1 ring-yellow-500/20"
                      : "bg-zinc-800/30 text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                  }
                `}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span className="text-sm">
                  ({activeTab === "watching" ? watchingAnime.length : 
                    activeTab === "towatch" ? toWatchAnime.length : 
                    watchedAnime.length})
                </span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Button>
            ))}
          </div>
        </nav>

        <AnimatePresence mode="wait">
          {activeTab === "watching" && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
            >
              {watchingAnime.map((anime) => (
                <AnimeCard
                  key={anime.id}
                  imageUrl={anime.imageUrl}
                  title={anime.name}
                  hreflink={`/anime/${anime.id}`}
                />
              ))}
            </motion.section>
          )}

          {activeTab === "towatch" && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
            >
              {toWatchAnime.map((anime) => (
                <AnimeCard
                  key={anime.id}
                  imageUrl={anime.imageUrl}
                  title={anime.name}
                  hreflink={`/anime/${anime.id}`}
                />
              ))}
            </motion.section>
          )}

          {activeTab === "watched" && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
            >
              {watchedAnime.map((anime) => (
                <AnimeCard
                  key={anime.id}
                  imageUrl={anime.imageUrl}
                  title={anime.name}
                  hreflink={`/anime/${anime.id}`}
                />
              ))}
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
