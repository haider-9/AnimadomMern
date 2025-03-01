import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useParams } from "react-router";
import { FaHeart, FaMicrophone, FaStar, FaFilm } from "react-icons/fa";

interface CharacterData {
  id: number;
  name: {
    full: string;
    native: string;
  };
  description: string;
  image: {
    large: string;
  };
  gender: string;
  dateOfBirth: {
    year: number | null;
    month: number | null;
    day: number | null;
  };
  age: string;
  favourites: number;
  media: {
    nodes: Array<{
      id: number;
      title: {
        english: string;
        romaji: string;
      };
      coverImage: {
        large: string;
      };
      bannerImage: string;
      averageScore: number;
      type: string;
    }>;
  };
}

export default function CharacterDetails() {
  const params = useParams();
  const [characterData, setCharacterData] = useState<CharacterData | null>(
    null
  );
  const [bannerImage, setBannerImage] = useState<string>("");

  useEffect(() => {
    const fetchCharacterData = async () => {
      const query = `
        query ($id: Int) {
          Character(id: $id) {
            id
            name {
              full
              native
            }
            description(asHtml: true)
            image {
              large
            }
            gender
            dateOfBirth {
              year
              month
              day
            }
            age
            favourites
            media(sort: POPULARITY_DESC, perPage: 12) {
              nodes {
                id
                title {
                  english
                  romaji
                }
                coverImage {
                  large
                }
                bannerImage
                averageScore
                type
              }
            }
          }
        }
      `;

      try {
        const response = await fetch("https://graphql.anilist.co", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query,
            variables: { id: parseInt(params.charid) },
          }),
        });

        const { data } = await response.json();
        setCharacterData(data.Character);
      } catch (error) {
        console.error("Error fetching character data:", error);
      }
    };

    if (params.charid) {
      fetchCharacterData();
    }
  }, [params.charid]);

  useEffect(() => {
    if (characterData?.media?.nodes) {
      const mediaWithImages = characterData.media.nodes.filter(
        (media) => media.bannerImage || media.coverImage.large
      );
      if (mediaWithImages.length > 0) {
        const randomIndex = Math.floor(Math.random() * mediaWithImages.length);
        setBannerImage(
          mediaWithImages[randomIndex].bannerImage ||
            mediaWithImages[randomIndex].coverImage.large
        );
      }
    }
  }, [characterData]);

  if (!characterData) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Hero Section */}
        <div className="relative h-[40vh] overflow-hidden">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            src={bannerImage || characterData.image.large}
            alt={characterData.name.full}
            className="absolute w-full h-full object-cover object-center"
            style={{ filter: "brightness(0.6) blur(8px)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900" />
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 -mt-32 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column - Character Profile */}
            <div className="md:col-span-1">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-zinc-800/40 backdrop-blur-xl rounded-2xl p-6 border border-zinc-700/50"
              >
                <img
                  src={characterData.image.large}
                  alt={characterData.name.full}
                  className="w-full rounded-xl shadow-xl mb-6"
                />

                <div className="space-y-4">
                  <div>
                    <h1 className="text-2xl font-bold">
                      {characterData.name.full}
                    </h1>
                    <p className="text-zinc-400">{characterData.name.native}</p>
                  </div>

                  <div className="flex items-center gap-2 bg-pink-500/20 p-4 rounded-xl">
                    <FaHeart className="text-pink-500" />
                    <span className="text-pink-200 font-medium">
                      {characterData.favourites.toLocaleString()} Favorites
                    </span>
                  </div>

                  <Link to={`/voiceactor/${characterData.id}`}>
                    <div className="flex items-center gap-2 mb-3 bg-purple-500/20 p-4 rounded-xl cursor-pointer hover:bg-purple-500/30 transition-all duration-300">
                      <FaMicrophone className="text-purple-500" />
                      <span className="text-purple-200 font-medium">
                        Voice Actors
                      </span>
                    </div>
                  </Link>

                  {characterData.gender && (
                    <div className="bg-zinc-700/30 p-4 rounded-xl">
                      <span className="text-zinc-400">Gender: </span>
                      <span className="font-medium">
                        {characterData.gender}
                      </span>
                    </div>
                  )}

                  {characterData.age && (
                    <div className="bg-zinc-700/30 p-4 rounded-xl">
                      <span className="text-zinc-400">Age: </span>
                      <span className="font-medium">{characterData.age}</span>
                    </div>
                  )}

                  {characterData.dateOfBirth.month && (
                    <div className="bg-zinc-700/30 p-4 rounded-xl">
                      <span className="text-zinc-400">Birthday: </span>
                      <span className="font-medium">
                        {`${characterData.dateOfBirth.month}/${characterData.dateOfBirth.day}`}
                        {characterData.dateOfBirth.year &&
                          `/${characterData.dateOfBirth.year}`}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Additional Info */}
            <div className="md:col-span-2 space-y-8">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-zinc-800/40 backdrop-blur-xl rounded-2xl p-8 border border-zinc-700/50"
              >
                <h2 className="text-2xl font-semibold mb-4">About</h2>
                <div
                  className="text-zinc-300 leading-relaxed prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{
                    __html:
                      characterData.description || "No description available.",
                  }}
                />

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-zinc-700/30 p-6 rounded-xl">
                    <h3 className="text-xl font-semibold mb-3">
                      Character Traits
                    </h3>
                    <ul className="space-y-2 text-zinc-300">
                      <li>• Personality Type</li>
                      <li>• Notable Features</li>
                      <li>• Character Arc</li>
                    </ul>
                  </div>
                  <div className="bg-zinc-700/30 p-6 rounded-xl">
                    <h3 className="text-xl font-semibold mb-3">Background</h3>
                    <ul className="space-y-2 text-zinc-300">
                      <li>• Origin Story</li>
                      <li>• Key Events</li>
                      <li>• Character Development</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Full Width Appearances Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mt-8 bg-zinc-800/40 backdrop-blur-xl rounded-2xl p-8 border border-zinc-700/50"
          >
            <h2 className="text-2xl font-semibold mb-6">Appearances</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {characterData.media.nodes.map((media) => (
                <Link
                  to={`/anime/${media.id}`}
                  key={media.id}
                  className="block bg-zinc-700/30 rounded-xl overflow-hidden hover:bg-zinc-700/50 transition-all duration-300"
                >
                  <div className="flex items-center gap-4 p-4">
                    <img
                      src={media.coverImage.large}
                      alt={media.title.english || media.title.romaji}
                      className="w-20 h-28 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-lg line-clamp-2">
                        {media.title.english || media.title.romaji}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <FaStar className="text-yellow-500" />
                        <span className="text-yellow-200">
                          {media.averageScore / 10}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
          
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
