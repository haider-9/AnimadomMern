import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useParams } from "react-router";
import { FaHeart, FaStar, FaUser, FaBirthdayCake } from "react-icons/fa";
import Loader from "~/components/loader";

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

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const { data } = await response.json();

        if (!data) {
          throw new Error("No data received from API");
        }

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

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-500/10 p-6 rounded-xl border border-red-500/20">
          <h2 className="text-red-500 text-xl font-semibold mb-2">
            Error Loading Data
          </h2>
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!personData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-yellow-500/10 p-6 rounded-xl border border-yellow-500/20">
          <h2 className="text-yellow-500 text-xl font-semibold mb-2">
            No Data Found
          </h2>
          <p className="text-yellow-400">Could not find person with ID: {id}</p>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="person-details"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen pb-16"
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
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900" />
        </div>

        <div className="container mx-auto px-4 -mt-32 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-zinc-800/40 backdrop-blur-xl rounded-2xl p-6 border border-zinc-700/50"
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
                      <p className="text-zinc-400">
                        {personData.alternate_names[0]}
                      </p>
                    )}
                  </div>

                  {personData.favorites > 0 && (
                    <div className="flex items-center gap-2 bg-pink-500/20 p-4 rounded-xl">
                      <FaHeart className="text-pink-500" />
                      <span className="text-pink-200 font-medium">
                        {personData.favorites.toLocaleString()} Favorites
                      </span>
                    </div>
                  )}

                  {personData.birthday && (
                    <div className="flex items-center gap-2 bg-zinc-700/30 p-4 rounded-xl">
                      <FaBirthdayCake className="text-zinc-400" />
                      <span className="text-zinc-300">
                        {new Date(personData.birthday).toLocaleDateString()}
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
                className="bg-zinc-800/40 backdrop-blur-xl rounded-2xl p-8 border border-zinc-700/50"
              >
                <h2 className="text-2xl font-semibold mb-4">About</h2>
                <div className="text-zinc-300 leading-relaxed prose prose-invert max-w-none">
                  {personData.about || "No description available."}
                </div>
              </motion.div>

              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab("characters")}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === "characters"
                      ? "bg-purple-500 text-white shadow-lg shadow-purple-500/25"
                      : "bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700/80"
                  }`}
                >
                  Voice Acting Roles
                </button>
                <button
                  onClick={() => setActiveTab("media")}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === "media"
                      ? "bg-purple-500 text-white shadow-lg shadow-purple-500/25"
                      : "bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700/80"
                  }`}
                >
                  Media
                </button>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === "characters" && personData.voices?.length > 0 ? (
                  <motion.div
                    key="characters"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    {personData.voices.map((voice) => (
                      <Link
                        to={`/character/${voice.character.mal_id}`}
                        key={`${voice.character.mal_id}-${voice.anime.mal_id}`}
                        className="group bg-zinc-800/40 rounded-xl overflow-hidden hover:bg-zinc-700/40 transition-all duration-300"
                      >
                        <div className="flex items-center gap-4 p-4">
                          <img
                            src={voice.character.images.jpg.image_url}
                            alt={voice.character.name}
                            className="w-20 h-28 object-cover rounded-lg transition-transform group-hover:scale-105"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium text-lg text-white group-hover:text-purple-300 transition-colors">
                              {voice.character.name}
                            </h3>
                            <p className="text-sm text-zinc-400 mt-1">
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
                    className="bg-zinc-800/40 backdrop-blur-xl rounded-2xl p-8 border border-zinc-700/50 text-center"
                  >
                    <p className="text-zinc-400">
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
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    {personData.anime.map((entry) => (
                      <Link
                        to={`/anime/${entry.anime.mal_id}`}
                        key={entry.anime.mal_id}
                        className="group bg-zinc-800/40 rounded-xl overflow-hidden hover:bg-zinc-700/40 transition-all duration-300"
                      >
                        <div className="flex items-center gap-4 p-4">
                          <img
                            src={entry.anime.images.jpg.image_url}
                            alt={entry.anime.title}
                            className="w-20 h-28 object-cover rounded-lg transition-transform group-hover:scale-105"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium text-lg text-white group-hover:text-purple-300 transition-colors">
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
                            <p className="text-sm text-zinc-400 mt-1">
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
                    className="bg-zinc-800/40 backdrop-blur-xl rounded-2xl p-8 border border-zinc-700/50 text-center"
                  >
                    <p className="text-zinc-400">
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
  );
}
