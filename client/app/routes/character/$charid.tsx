import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import {
  FaHeart,
  FaMicrophone,
  FaStar,
  FaUser,
  FaClock,
  FaCaretUp,
  FaCaretDown,
  FaCakeCandles,
} from "react-icons/fa6";
import type { Route } from "./+types/$charid";
import Loading from "~/components/loader";

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
interface GalleryImage {
  jpg: {
    image_url: string;
  };
}

export default function CharacterDetails({ params }: Route.ComponentProps) {
  const [characterData, setCharacterData] = useState<CharacterData | null>(
    null
  );
  const [bannerImage, setBannerImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isGalleryExpanded, setIsGalleryExpanded] = useState(false);

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
        }`;

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
        if (!data?.Character) {
          return;
        }
        setCharacterData(data.Character);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching character data:", error);
        setIsLoading(false);
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
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch(
          `https://api.jikan.moe/v4/characters/${params.charid}/pictures`
        );
        const data = await response.json();
        setGalleryImages(data.data);
      } catch (error) {
        console.error("Error fetching gallery:", error);
      }
    };

    if (params.charid) {
      fetchGallery();
    }
  }, [params.charid]);
  if (!characterData) return null;
  if (isLoading) return <Loading />;

  return (
    <>
      <head>
        <title>{`Animadom | ${characterData.name.full} `}</title>
        <meta name="description" content={characterData.description} />
        <meta name="keywords" content={characterData.name.full} />

        <meta
          property="og:title"
          content={`Animadom | ${characterData.name.full}`}
        />
        <meta property="og:image" content={characterData.image.large} />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`https://animadom.vercel.app/characters/${params.charid}`}
        />
      </head>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Hero Section */}
          <div className="relative h-[40vmin] overflow-hidden">
            <motion.img
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              src={bannerImage || characterData.image.large}
              alt={characterData.name.full}
              className="absolute w-full h-full object-cover object-center brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900" />
          </div>

          {/* Main Content */}
          <div className="container mx-auto px-4 -mt-10 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Column - Character Profile */}
              <div className="md:col-span-1">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="bg-zinc-800/40 backdrop-blur-xl rounded-2xl p-6 border border-zinc-700/50 h-full"
                >
                  <div className="flex flex-col md:flex-col gap-6">
                    <img
                      src={characterData.image.large}
                      alt={characterData.name.full}
                      className="rounded-xl shadow-xl w-full md:w-full max-w-[300px] object-cover object-center mx-auto"
                    />

                    <div className="space-y-4 flex-1">
                      <div>
                        <h1 className="text-2xl font-bold">
                          {characterData.name.full}
                        </h1>
                        <p className="text-zinc-400">
                          {characterData.name.native}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
                        <div className="flex items-center gap-2 bg-pink-500/20 p-4 rounded-xl">
                          <FaHeart className="text-pink-500 text-xl" />
                          <span className="text-pink-200 font-medium">
                            {characterData.favourites.toLocaleString()}{" "}
                            Favorites
                          </span>
                        </div>

                        <Link to={`/voiceactor/${characterData.id}`}>
                          <div className="flex items-center gap-2 bg-purple-500/20 p-4 rounded-xl cursor-pointer hover:bg-purple-500/30 transition-all duration-300">
                            <FaMicrophone className="text-purple-500 text-xl" />
                            <span className="text-purple-200 font-medium">
                              Voice Actors
                            </span>
                          </div>
                        </Link>

                        {characterData.gender && (
                          <div className="flex items-center gap-2 bg-zinc-700/30 p-4 rounded-xl">
                            <FaUser className="text-zinc-400 text-xl" />
                            <span className="font-medium">
                              {characterData.gender}
                            </span>
                          </div>
                        )}

                        {characterData.age && (
                          <div className="flex items-center gap-2 bg-zinc-700/30 p-4 rounded-xl">
                            <FaClock className="text-zinc-400 text-xl" />
                            <span className="font-medium">
                              {characterData.age}
                            </span>
                          </div>
                        )}

                        {characterData.dateOfBirth.month && (
                          <div className="flex items-center gap-2 bg-zinc-700/30 p-4 rounded-xl">
                            <FaCakeCandles className="text-zinc-400 text-xl" />
                            <span className="font-medium">
                              {new Intl.DateTimeFormat("en-US", {
                                day: "2-digit",
                                month: "short",
                              }).format(
                                new Date(
                                  0,
                                  characterData.dateOfBirth.month - 1,
                                  characterData.dateOfBirth?.day ?? 0
                                )
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
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
                  <div className="relative">
                    <div
                      className={`text-zinc-300 leading-relaxed prose prose-invert max-w-none rounded-b-xl ${
                        !isExpanded &&
                        "max-h-[400px] overflow-hidden relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-24 after:bg-gradient-to-t after:from-zinc-800 after:to-transparent"
                      }`}
                      dangerouslySetInnerHTML={{
                        __html:
                          characterData.description ||
                          "No description available.",
                      }}
                    />
                    {characterData.description &&
                      characterData.description.length > 200 && (
                        <div
                          className={`absolute left-1/2 -translate-x-1/2 ${
                            !isExpanded && "-translate-y-1/2"
                          }`}
                        >
                          <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="mt-2 px-6 py-2 text-sm text-white hover:text-zinc-100 transition-all duration-200 mx-auto bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold cursor-pointer inline-flex gap-1 items-center shadow-lg hover:shadow-indigo-500/30"
                          >
                            {isExpanded ? "Read Less" : "Read More"}
                            {isExpanded ? <FaCaretUp /> : <FaCaretDown />}
                          </button>
                        </div>
                      )}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="mt-8 bg-zinc-800/40 backdrop-blur-xl rounded-2xl p-8 border border-zinc-700/50"
                >
                  <h2 className="text-2xl font-semibold mb-6">Gallery</h2>
                  <div className="relative">
                    <div
                      className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${
                        !isGalleryExpanded &&
                        "max-h-[600px] overflow-hidden relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-24 after:bg-gradient-to-t after:from-zinc-800 after:to-transparent"
                      }`}
                    >
                      {galleryImages.map((image, index) => (
                        <img
                          key={index}
                          src={image.jpg.image_url}
                          alt={`${characterData?.name.full} gallery image ${
                            index + 1
                          }`}
                          className="w-full h-64 object-cover rounded-xl hover:scale-105 transition-transform duration-300"
                        />
                      ))}
                    </div>
                    {galleryImages.length > 8 && (
                      <div
                        className={`absolute left-1/2 -translate-x-1/2 ${
                          !isGalleryExpanded && "-translate-y-1/2"
                        }`}
                      >
                        <button
                          onClick={() =>
                            setIsGalleryExpanded(!isGalleryExpanded)
                          }
                          className="mt-2 px-6 py-2 text-sm text-white hover:text-zinc-100 transition-all duration-200 mx-auto bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold cursor-pointer inline-flex gap-1 items-center shadow-lg hover:shadow-indigo-500/30"
                        >
                          {isGalleryExpanded ? "Show Less" : "Show More"}
                          {isGalleryExpanded ? <FaCaretUp /> : <FaCaretDown />}
                        </button>
                      </div>
                    )}
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
    </>
  );
}
