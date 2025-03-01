import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaRegStar, FaPlay, FaCheckCircle, FaFilm } from "react-icons/fa";
import { Link, useParams } from "react-router"; // Fixed import
import AnimeCard from "~/components/animecard";
import { Button } from "~/components/ui/button";

interface AnimeData {
  title_english: string;
  title: string;
  episodes: number;
  title_synonyms: string[];
  synopsis: string;
  score: number;
  genres: Array<{ mal_id: number; name: string }>;
  type: string;
  status: string;
}

interface DateDetails {
  year: number | null;
  month: number | null;
  day: number | null;
}

interface AnimeDetails {
  coverImage: string;
  posterImage: string;
  startDate: DateDetails | null;
  endDate: DateDetails | null;
  nextEpisode: {
    episode: number;
    timeUntilAiring: number;
  } | null;
  reviews: Array<{ score: number; summary: string }>;
  trailer: {
    id: string;
    site: string;
    thumbnail: string;
  } | null;
  tags: Array<{ name: string; rank: number }>;
  studios: Array<{ name: string; isAnimationStudio: boolean }>;
}

interface Character {
  character: {
    mal_id: number;
    name: string;
    images: {
      jpg: {
        image_url: string;
      };
    };
  };
  role: string;
}

interface Recommendation {
  mal_id: number; // Added mal_id
  entry: {
    mal_id: number;
    title: string;
    images: {
      jpg: {
        large_image_url: string;
      };
    };
  };
}

export default function AnimeDescription() {
  const params = useParams();
  const [animeData, setAnimeData] = useState<AnimeData | null>(null);
  const [animeCharacters, setAnimeCharacters] = useState<Character[]>([]);
  const [similarAnime, setSimilarAnime] = useState<Recommendation[]>([]);
  const [animeDetails, setAnimeDetails] = useState<AnimeDetails>({
    coverImage: "",
    posterImage: "",
    startDate: { year: null, month: null, day: null },
    endDate: { year: null, month: null, day: null },
    nextEpisode: null,
    reviews: [],
    trailer: null,
    tags: [],
    studios: [],
  });

  useEffect(() => {
    const fetchJikanData = async () => {
      const responses = await Promise.all([
        fetch(`https://api.jikan.moe/v4/anime/${params.animeId}`),
        fetch(`https://api.jikan.moe/v4/anime/${params.animeId}/characters`),
        fetch(
          `https://api.jikan.moe/v4/anime/${params.animeId}/recommendations`
        ),
      ]);

      const [animeResponse, charsResponse, recsResponse] = await Promise.all(
        responses.map((res) => res.json())
      );

      return {
        animeData: animeResponse.data,
        characters: charsResponse.data,
        recommendations: recsResponse.data,
      };
    };

    const fetchAniListData = async (malId: string) => {
      const query = `
        query ($idMal: Int) {
          Media(idMal: $idMal, type: ANIME) {
            coverImage {
              extraLarge
              large
            }
            bannerImage
            startDate {
              year
              month
              day
            }
            endDate {
              year
              month
              day
            }
            nextAiringEpisode {
              airingAt
              timeUntilAiring
              episode
            }
            reviews {
              nodes {
                summary
                score
                rating
              }
            }
            trailer {
              id
              site
              thumbnail
            }
            tags {
              name
              rank
            }
            studios {
              nodes {
                name
                isAnimationStudio
              }
            }
          }
        }
      `;

      const response = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          variables: { idMal: parseInt(malId) },
        }),
      });

      const { data } = await response.json();
      const media = data?.Media;

      return {
        coverImage: media?.bannerImage || "",
        posterImage:
          media?.coverImage?.extraLarge || media?.coverImage?.large || "",
        startDate: media?.startDate || { year: null, month: null, day: null },
        endDate: media?.endDate || { year: null, month: null, day: null },
        nextEpisode: media?.nextAiringEpisode
          ? {
              episode: media.nextAiringEpisode.episode,
              timeUntilAiring: media.nextAiringEpisode.timeUntilAiring,
            }
          : null,
        reviews: media?.reviews?.nodes || [],
        trailer: media?.trailer || null,
        tags: media?.tags || [],
        studios: media?.studios?.nodes || [],
      };
    };

    const loadAllData = async () => {
      try {
        const jikanData = await fetchJikanData();
        setAnimeData(jikanData.animeData);
        setAnimeCharacters(
          jikanData.characters?.filter(
            (char: Character) => char.role === "Main"
          ) || []
        );
        setSimilarAnime(
          jikanData.recommendations
            ?.slice(0, 10)
            .map((item: Recommendation) => item.entry) || []
        );

        if (params.animeId) {
          const anilistData = await fetchAniListData(params.animeId);
          setAnimeDetails(anilistData);
        }
      } catch (error) {
        console.error("Error loading anime data:", error);
      }
    };

    loadAllData();
  }, [params.animeId]);

  const { startDate, endDate, nextEpisode } = animeDetails;
  const { title, title_english, genres, score, episodes, type, synopsis } =
    animeData || {
      title: "",
      title_english: "",
      genres: [],
      score: 0,
      episodes: 0,
      type: "",
      synopsis: "",
    };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Hero Section */}
        <div className="relative h-[50vh] md:h-[70vh] overflow-hidden">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            src={animeDetails.coverImage || "/banner404.jpg"}
            alt={title_english || title}
            className="absolute w-full h-full object-cover"
            style={{ filter: "brightness(0.6)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900" />
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
            <div className="container mx-auto flex flex-col md:flex-row gap-4 md:gap-8">
              <motion.img
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                src={animeDetails.posterImage || "/poster404.jpg"}
                alt={title_english || title}
                className="w-32 h-48 md:w-48 md:h-72 rounded-xl shadow-2xl object-cover"
              />
              <div className="flex flex-col justify-end">
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4"
                >
                  {title_english || title}
                </motion.h1>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap gap-2 mb-4 md:mb-6"
                >
                  {genres.map((genre) => (
                    <Link key={genre.mal_id} to={`/genre/${genre.name}`}>
                      <span className="px-2 md:px-3 py-1 bg-zinc-800/80 rounded-full text-xs md:text-sm hover:bg-blue-600/80 transition-colors duration-300">
                        {genre.name}
                      </span>
                    </Link>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Column */}
            <div className="lg:col-span-2 mt-8 space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-zinc-800/40 backdrop-blur-sm rounded-2xl p-6 hover:bg-zinc-800/60 transition-all duration-300">
                  <div className="flex flex-col items-center gap-3">
                    <FaRegStar className="text-yellow-500 text-2xl" />
                    <div className="text-center">
                      <span className="text-2xl font-bold">{score}</span>
                      <span className="text-zinc-400 text-sm">/10</span>
                    </div>
                  </div>
                </div>
                <Link to={`/episodes/${params.animeId}`}>
                  <div className="bg-zinc-800/40 backdrop-blur-sm rounded-2xl p-6 hover:bg-zinc-800/60 transition-all duration-300">
                    <div className="flex flex-col items-center gap-3">
                      <FaPlay className="text-blue-500 text-2xl" />
                      <div className="text-center">
                        <span className="text-xl font-medium">
                          {episodes || "TBA"}
                        </span>
                        <span className="text-zinc-400 text-sm block">
                          Episodes
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="bg-zinc-800/40 backdrop-blur-sm rounded-2xl p-6 hover:bg-zinc-800/60 transition-all duration-300">
                  <div className="flex flex-col items-center gap-3">
                    <FaFilm className="text-purple-500 text-2xl" />
                    <div className="text-center">
                      <span className="text-xl font-medium">{type}</span>
                      <span className="text-zinc-400 text-sm block">Type</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-zinc-800/40 backdrop-blur-sm rounded-2xl p-8 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-zinc-200 mb-4">
                      Studios
                    </h3>

                    <div className="flex flex-wrap gap-3">
                      {animeDetails?.studios?.map(
                        (
                          studio: { name: string; isAnimationStudio: boolean },
                          index: number
                        ) => (
                          <Link
                            to={`/studio/${studio.name}`}
                            key={index}
                            className={`text-sm px-4 py-2 rounded-xl transition-all duration-300 ${
                              studio.isAnimationStudio
                                ? "bg-purple-500/30 text-purple-200 border border-purple-500/40 hover:bg-purple-500/40"
                                : "bg-zinc-700/60 text-zinc-300 hover:bg-zinc-700/80"
                            }`}
                          >
                            {studio.name}
                          </Link>
                        )
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-zinc-200 mb-4">
                      Broadcast
                    </h3>
                    <div className="space-y-4">
                      {/* Start Date */}
                      <div className="flex items-center gap-3 bg-zinc-700/30 p-4 rounded-xl">
                        <span className="text-zinc-400">Started:</span>
                        <span className="font-medium">
                          {startDate?.year
                            ? `${startDate.year}/${startDate.month}/${startDate.day}`
                            : "Unknown"}
                        </span>
                      </div>

                      {/* Next Episode */}
                      {nextEpisode && (
                        <div className="flex items-center gap-3 bg-blue-500/20 p-4 rounded-xl">
                          <span className="text-blue-300">
                            Next Episode {nextEpisode.episode}:
                          </span>
                          <span className="text-blue-200 font-medium">
                            {Math.floor(nextEpisode.timeUntilAiring / 86400)}{" "}
                            days
                          </span>
                        </div>
                      )}

                      {/* End Date */}
                      <div className="flex items-center gap-3 bg-zinc-700/30 p-4 rounded-xl">
                        <span className="text-zinc-400">Ended:</span>
                        <span className="font-medium">
                          {endDate?.year
                            ? `${endDate.year}/${endDate.month}/${endDate.day}`
                            : "Ongoing"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
              >
                <h2 className="text-2xl font-semibold mb-4">Synopsis</h2>
                <p className="text-zinc-300 leading-relaxed">{synopsis}</p>
              </motion.section>

              <section className="mb-12">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold">Main Characters</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 p-4">
                  {animeCharacters?.map((char) => (
                    <Link
                      key={char.character.mal_id}
                      to={`/chars/${char.character.mal_id}`}
                    >
                      <motion.div className="relative group h-[320px] rounded-[2rem] cursor-pointer perspective-1000">
                        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-zinc-900/50 to-zinc-900 rounded-[2rem] backdrop-blur-xl" />
                        <div className="absolute -z-20 inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-[2rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        <img
                          src={char.character.images.jpg.image_url}
                          alt={char.character.name}
                          className="w-full h-full object-cover rounded-[2rem]"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent rounded-b-[2rem]">
                          <h3 className="text-xl font-bold text-white">
                            {char.character.name}
                          </h3>
                          <p className="text-sm text-zinc-400 mt-1">
                            {char.role}
                          </p>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-4 sticky mt-8">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gradient-to-br from-zinc-800/40 to-zinc-900/40 backdrop-blur-xl rounded-2xl p-6 border border-zinc-700/50 shadow-xl"
                >
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <span>Tags</span>
                  </h2>

                  <div className="flex flex-wrap gap-3">
                    {animeDetails?.tags
                      ?.slice(0, 12)
                      .map((tag: { name: string }, index: number) => (
                        <Link to={`/genre/${tag.name}`} key={index}>
                          <motion.span
                            whileHover={{
                              backgroundColor: "rgba(139, 92, 246, 0.2)",
                            }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-block px-4 py-2 text-sm bg-zinc-800/70 hover:bg-violet-500/20 
                     rounded-xl text-zinc-200 border border-zinc-700/50 hover:border-violet-500/30 
                     transition-colors duration-300 cursor-pointer shadow-lg"
                          >
                            {tag.name}
                          </motion.span>
                        </Link>
                      ))}
                  </div>
                </motion.div>

                {/* Reviews Preview */}
                {animeDetails?.reviews?.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gradient-to-br from-zinc-800/40 to-zinc-900/40 backdrop-blur-xl rounded-2xl p-6 border border-zinc-700/50 shadow-xl"
                  >
                    <h2 className="text-xl font-semibold mb-4">
                      Latest Reviews
                    </h2>
                    {animeDetails.reviews
                      .slice(0, 2)
                      .map(
                        (
                          review: { score: number; summary: string },
                          index: number
                        ) => (
                          <div key={index} className="mb-4 last:mb-0">
                            <div className="flex items-center gap-2 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <FaRegStar
                                  key={i}
                                  className={
                                    i < review.score / 20
                                      ? "text-yellow-500"
                                      : "text-zinc-600"
                                  }
                                />
                              ))}
                            </div>
                            <p className="text-sm text-zinc-300 line-clamp-2">
                              {review.summary}
                            </p>
                          </div>
                        )
                      )}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
