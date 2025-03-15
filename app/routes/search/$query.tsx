import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router";
import AnimeCard from "~/components/animecard";
import CharacterCard from "~/components/charactercard";
import { Button } from "~/components/ui/button";
import Loading from "~/components/loader";

interface AnimeResult {
  idMal: number;
  title: {
    romaji: string;
    english: string;
  };
  coverImage: {
    large: string;
  };
  averageScore: number;
}

interface CharacterResult {
  mal_id: number;
  name: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
  anime: any[];
}

interface VoiceActorResult {
  mal_id: number;
  name: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
  anime: any[];
}

interface SearchResults {
  anime: AnimeResult[];
  characters: CharacterResult[];
  genres: AnimeResult[];
  voiceActors: VoiceActorResult[];
}

const ANILIST_ENDPOINT = "https://graphql.anilist.co";
const JIKAN_ENDPOINT = "https://api.jikan.moe/v4";
const ITEMS_PER_PAGE = 20;

export default function SearchResults() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState("anime");
  const [loading, setLoading] = useState(true);

  const [results, setResults] = useState<SearchResults>({
    anime: [],
    characters: [],
    genres: [],
    voiceActors: [],
  });

  const [currentPage, setCurrentPage] = useState({
    anime: 1,
    characters: 1,
    genres: 1,
    voiceActors: 1,
  });

  const [totalPages, setTotalPages] = useState({
    anime: 1,
    characters: 1,
    genres: 1,
    voiceActors: 1,
  });

  const queries = {
    anime: `query ($search: String, $page: Int) {
      Page(page: $page, perPage: ${ITEMS_PER_PAGE}) {
        pageInfo {
          total
          currentPage
          lastPage
        }
        media(search: $search, type: ANIME, sort: FAVOURITES_DESC) {
          idMal
          title { 
            romaji 
            english
          }
          coverImage { large }
          startDate { year }
          genres
          averageScore
        }
      }
    }`,
    genres: `query ($genre: String, $page: Int) {
      Page(page: $page, perPage: ${ITEMS_PER_PAGE}) {
        pageInfo {
          total
          currentPage
          lastPage
        }
        media(genre: $genre, type: ANIME, sort: FAVOURITES_DESC) {
          idMal
          title { 
            romaji 
            english
          }
          coverImage { large }
          startDate { year }
          genres
          averageScore
        }
      }
    }`,
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage((prev) => ({
      ...prev,
      [activeTab]: newPage,
    }));
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    const query = decodeURIComponent(params.query || "");

    try {
      const [animeData, charactersData, genresData, voiceActorsData] =
        await Promise.all([
          fetch(ANILIST_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query: queries.anime,
              variables: {
                search: query,
                page: currentPage.anime,
              },
            }),
          }).then((res) => res.json()),
          fetch(
            `${JIKAN_ENDPOINT}/characters?q=${query}&page=${currentPage.characters}&limit=${ITEMS_PER_PAGE}&order_by=favorites&sort=desc`
          ).then((res) => res.json()),
          fetch(ANILIST_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query: queries.genres,
              variables: {
                genre: query,
                page: currentPage.genres,
              },
            }),
          }).then((res) => res.json()),
          fetch(
            `${JIKAN_ENDPOINT}/people?q=${query}&page=${currentPage.voiceActors}&limit=${ITEMS_PER_PAGE}&order_by=favorites&sort=desc`
          ).then((res) => res.json()),
        ]);

      setResults({
        anime: animeData.data?.Page?.media || [],
        characters: charactersData.data || [],
        genres: genresData.data?.Page?.media || [],
        voiceActors: voiceActorsData.data || [],
      });

      setTotalPages({
        anime: animeData.data?.Page?.pageInfo?.lastPage || 1,
        characters: Math.ceil(
          (charactersData.pagination?.items?.total || ITEMS_PER_PAGE) /
            ITEMS_PER_PAGE
        ),
        genres: genresData.data?.Page?.pageInfo?.lastPage || 1,
        voiceActors: Math.ceil(
          (voiceActorsData.pagination?.items?.total || ITEMS_PER_PAGE) /
            ITEMS_PER_PAGE
        ),
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [params.query, currentPage, activeTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const tabs = [
    { id: "anime", label: "Anime", icon: "🎬" },
    { id: "characters", label: "Characters", icon: "👥" },
    { id: "genres", label: "Genres", icon: "🏷️" },
    { id: "voiceActors", label: "Voice Actors", icon: "🎤" },
  ];

  if (loading) return <Loading />;

  return (
    <>
      <title>Search Results for {params.query}</title>
      <div className="min-h-screen mt-3">
        <div className="container mx-auto px-6">
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
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500"
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

          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap justify-center gap-4"
          >
            {activeTab === "anime" &&
              results.anime.map((anime) => (
                <AnimeCard
                  key={anime.idMal}
                  imageUrl={anime.coverImage.large}
                  title={anime.title.english || anime.title.romaji}
                  hreflink={`/anime/${anime.idMal}`}
                  score={anime.averageScore / 10}
                />
              ))}

            {activeTab === "characters" &&
              results.characters.map((char) => (
                <CharacterCard
                  key={char.mal_id}
                  imageUrl={char.images?.jpg?.image_url}
                  name={char.name}
                  role="Main"
                  hreflink={`/character/${char.mal_id}`}
                  animeAppearances={char.anime?.length || 0}
                />
              ))}

            {activeTab === "genres" &&
              results.genres.map((anime) => (
                <AnimeCard
                  key={anime.idMal}
                  imageUrl={anime.coverImage.large}
                  title={anime.title.english || anime.title.romaji}
                  hreflink={`/anime/${anime.idMal}`}
                  score={anime.averageScore / 10}
                />
              ))}

            {activeTab === "voiceActors" &&
              results.voiceActors.map((actor) => (
                <CharacterCard
                  key={actor.mal_id}
                  imageUrl={actor.images?.jpg?.image_url}
                  name={actor.name}
                  role="Voice Actor"
                  hreflink={`/people/${actor.mal_id}`}
                  animeAppearances={actor.anime?.length || 0}
                />
              ))}
          </motion.div>

          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-2 overflow-x-auto px-4 py-2 max-w-[90vw]">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage[activeTab] - 1)}
                disabled={currentPage[activeTab] === 1}
              >
                Previous
              </Button>

              {[...Array(totalPages[activeTab])].map((_, index) => {
                if (
                  index === 0 ||
                  index === totalPages[activeTab] - 1 ||
                  (index >= currentPage[activeTab] - 2 &&
                    index <= currentPage[activeTab] + 2)
                ) {
                  return (
                    <Button
                      key={index + 1}
                      variant={
                        currentPage[activeTab] === index + 1
                          ? "default"
                          : "outline"
                      }
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </Button>
                  );
                }

                if (
                  index === currentPage[activeTab] - 3 ||
                  index === currentPage[activeTab] + 3
                ) {
                  return (
                    <span key={index} className="text-white">
                      ...
                    </span>
                  );
                }

                return null;
              })}

              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage[activeTab] + 1)}
                disabled={currentPage[activeTab] === totalPages[activeTab]}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
