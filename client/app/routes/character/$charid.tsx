import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router";
import AnimeCard from "~/components/animecard";
import { FaHeart } from "react-icons/fa";

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

            {/* Right Column - Description and Appearances */}
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
                    __html: characterData.description,
                  }}
                />
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl font-semibold mb-6">Appearances</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {characterData.media.nodes.map((media) => (
                    <AnimeCard
                      key={media.id}
                      imageUrl={media.coverImage.large}
                      title={media.title.english || media.title.romaji}
                      hreflink={`/anime/${media.id}`}
                      score={media.averageScore / 10}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
