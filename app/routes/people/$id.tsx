import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useParams } from "react-router";
import { FaHeart, FaStar, FaBirthdayCake } from "react-icons/fa";
import Loader from "~/components/loader";
import { Button } from "~/components/ui/button";

interface PersonData {
  mal_id: number;
  name: string;
  given_name: string;
  family_name: string;
  alternate_names: string[];
  birthday: string;
  favorites: number;
  about: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
  voices: Array<{
    role: string;
    character: {
      mal_id: number;
      name: string;
      images: {
        jpg: {
          image_url: string;
        };
      };
      anime: {
        mal_id: number;
        title: string;
        images: {
          jpg: {
            image_url: string;
          };
        };
      };
    };
  }>;
  anime: Array<{
    position: string;
    anime: {
      mal_id: number;
      title: string;
      images: {
        jpg: {
          image_url: string;
        };
      };
      score: number;
    };
  }>;
}

const tabs = [
  { id: "characters", label: "Voice Acting Roles", icon: "🎭" },
  { id: "media", label: "Media", icon: "🎬" },
];

export default function PersonDetails() {
  const { id } = useParams<{ id: string }>();
  const [personData, setPersonData] = useState<PersonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"characters" | "media">(
    "characters"
  );

  useEffect(() => {
    const fetchPersonData = async () => {
      if (!id) {
        setError("No ID provided");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://api.jikan.moe/v4/people/${id}/full`
        );
        if (!response.ok)
          throw new Error(`API request failed with status ${response.status}`);
        const { data } = await response.json();
        if (!data) throw new Error("No data received from API");
        setPersonData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
        console.error("Error fetching person data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonData();
  }, [id]);

  if (loading) return <Loader />;
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-destructive/10 p-6 rounded-xl border border-destructive/20">
          <h2 className="text-destructive text-xl font-semibold mb-2">
            Error Loading Data
          </h2>
          <p className="text-destructive/80">{error}</p>
        </div>
      </div>
    );
  }
  if (!personData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-muted/10 p-6 rounded-xl border border-muted/20">
          <h2 className="text-muted-foreground text-xl font-semibold mb-2">
            No Data Found
          </h2>
          <p className="text-muted-foreground/80">Could not find person with ID: {id}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <title>{`AnimaDom | ${personData.name}`}</title>
      <AnimatePresence mode="wait">
        <motion.div
          key="person-details"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen pb-16 theme-transition"
        >
          <div className="relative h-[40vh] overflow-hidden">
            <motion.img
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              src={personData.images.jpg.image_url}
              alt={personData.name}
              className="absolute w-full h-full object-cover object-center"
              style={{ filter: "brightness(0.6) blur(8px)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background" />
          </div>

          <div className="container mx-auto px-4 -mt-32 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="bg-card/40 backdrop-blur-xl rounded-2xl p-6 border border-border"
                >
                  <img
                    src={personData.images.jpg.image_url}
                    alt={personData.name}
                    className="w-full rounded-xl shadow-xl mb-6"
                  />
                  <div className="space-y-4">
                    <div>
                      <h1 className="text-2xl font-bold">{personData.name}</h1>
                      {personData.alternate_names?.length > 0 && (
                        <p className="text-muted-foreground">
                          {personData.alternate_names[0]}
                        </p>
                      )}
                    </div>
                    {personData.favorites > 0 && (
                      <div className="flex items-center gap-2 bg-primary/20 p-4 rounded-xl">
                        <FaHeart className="text-primary" />
                        <span className="text-primary-foreground font-medium">
                          {personData.favorites.toLocaleString()} Favorites
                        </span>
                      </div>
                    )}
                    {personData.birthday && (
                      <div className="flex items-center gap-2 bg-muted/30 p-4 rounded-xl">
                        <FaBirthdayCake className="text-muted-foreground" />
                        <span className="text-foreground">
                          {new Date(personData.birthday).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>

              <div className="md:col-span-2 space-y-8">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="bg-card/40 backdrop-blur-xl rounded-2xl p-8 border border-border"
                >
                  <h2 className="text-2xl font-semibold mb-4">About</h2>
                  <div className="text-muted-foreground leading-relaxed prose prose-invert max-w-none">
                    {personData.about || "No description available."}
                  </div>
                </motion.div>

                <nav className="flex flex-col sm:flex-row gap-3 mb-6 bg-card/80 p-4 rounded-xl sticky top-0 backdrop-blur-sm z-10 border border-border">
                  <div className="grid grid-cols-2 sm:flex sm:flex-row gap-3 w-full">
                    {tabs.map((tab) => (
                      <Button
                        key={tab.id}
                        onClick={() =>
                          setActiveTab(tab.id as "characters" | "media")
                        }
                        className={`
                          relative group flex items-center justify-center gap-2
                          ${
                            activeTab === tab.id
                              ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                              : "bg-secondary/30 text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                          }
                        `}
                      >
                        <span>{tab.icon}</span>
                        <span>{tab.label}</span>
                        {activeTab === tab.id && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 30,
                            }}
                          />
                        )}
                      </Button>
                    ))}
                  </div>
                </nav>

                <AnimatePresence mode="wait">
                  {activeTab === "characters" &&
                  personData.voices?.length > 0 ? (
                    <motion.div
                      key="characters"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto"
                    >
                      {personData.voices.map((voice) => (
                        <Link
                          to={`/character/${voice.character.mal_id}`}
                          key={`${voice.character.mal_id}-${voice.anime.mal_id}`}
                          className="group bg-card/40 rounded-xl overflow-hidden hover:bg-card/60 transition-all duration-300"
                        >
                          <div className="flex items-center gap-4 p-4">
                            <img
                              src={voice.character.images.jpg.image_url}
                              alt={voice.character.name}
                              className="w-20 h-28 object-cover rounded-lg transition-transform group-hover:scale-105"
                            />
                            <div className="flex-1">
                              <h3 className="font-medium text-lg text-foreground group-hover:text-primary transition-colors">
                                {voice.character.name}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {voice.anime.title}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  ) : activeTab === "characters" ? (
                    <motion.div
                      key="no-characters"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="bg-card/40 backdrop-blur-xl rounded-2xl p-8 border border-border text-center"
                    >
                      <p className="text-muted-foreground">
                        No character roles found for this person.
                      </p>
                    </motion.div>
                  ) : null}

                  {activeTab === "media" && personData.anime?.length > 0 ? (
                    <motion.div
                      key="media"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto"
                    >
                      {personData.anime.map((entry) => (
                        <Link
                          to={`/anime/${entry.anime.mal_id}`}
                          key={entry.anime.mal_id}
                          className="group bg-card/40 rounded-xl overflow-hidden hover:bg-card/60 transition-all duration-300"
                        >
                          <div className="flex items-center gap-4 p-4">
                            <img
                              src={entry.anime.images.jpg.image_url}
                              alt={entry.anime.title}
                              className="w-20 h-28 object-cover rounded-lg transition-transform group-hover:scale-105"
                            />
                            <div className="flex-1">
                              <h3 className="font-medium text-lg text-foreground group-hover:text-primary transition-colors">
                                {entry.anime.title}
                              </h3>
                              {entry.anime.score && (
                                <div className="flex items-center gap-2 mt-2">
                                  <FaStar className="text-yellow-500" />
                                  <span className="text-yellow-200">
                                    {entry.anime.score.toFixed(1)}
                                  </span>
                                </div>
                              )}
                              <p className="text-sm text-muted-foreground mt-1">
                                {entry.position}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  ) : activeTab === "media" ? (
                    <motion.div
                      key="no-media"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="bg-card/40 backdrop-blur-xl rounded-2xl p-8 border border-border text-center"
                    >
                      <p className="text-muted-foreground">
                        No media found for this person.
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
