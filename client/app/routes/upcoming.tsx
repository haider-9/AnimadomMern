import AnimeCard from "../components/AnimeCard";
import { useEffect, useState } from "react";
import Loading from "~/components/loader";

export default function TrendingAnime() {
  interface Anime {
    id: number;
    title: {
      romaji: string;
    };
    coverImage: {
      large: string;
    };
    idMal?: number;
    averageScore: number;
  }

  const [trendingAnime, setTrendingAnime] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    handlePageChange(currentPage);
  }, [currentPage]);
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePageChange = async (newPage: number) => {
      setIsLoading(true);
      setCurrentPage(newPage);
      scrollToTop();
  
      try {
        const query = `
          query ($page: Int) {
            Page(page: $page, perPage: 20) {
              pageInfo {
                hasNextPage
                total
                currentPage
                lastPage
              }
              media(type: ANIME, status: NOT_YET_RELEASED, sort: POPULARITY_DESC) {
                title {
                  romaji
                  english
                }
                coverImage {
                  large
                }
                idMal
                averageScore
              }
            }
          }
        `;

        const response = await fetch("https://graphql.anilist.co", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query,
            variables: { page: newPage },
          }),
        });

        const data = await response.json();
        setTrendingAnime(data.data.Page.media);
        setHasNextPage(data.data.Page.pageInfo.hasNextPage);
      } catch (err) {
        setError("Failed to fetch anime");
      } finally {
        setIsLoading(false);
      }
    };
  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }
  if(isLoading) {
    return <Loading />;
  }

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-6 px-4">UpComing Anime</h2>
      <div className="flex flex-wrap justify-center w-[95%] gap-4 mx-auto">
        {trendingAnime.map((anime) => (
          <AnimeCard
            key={anime.idMal}
            title={anime.title.english || anime.title.romaji}
            imageUrl={anime.coverImage.large}
            hreflink={`/anime/${anime.idMal}`}
            score={anime.averageScore}
          />
        ))}
      </div>
      <div className="flex justify-center mt-8 gap-4 pb-8">
        {currentPage > 1 && (
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={isLoading}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Previous
          </button>
        )}
        <div className="flex items-center gap-2">
          <span className="text-gray-700 font-semibold bg-gray-100 py-2 px-4 rounded">
            Page {currentPage}
          </span>
        </div>
        {hasNextPage && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            {isLoading ? "Loading..." : "Next"}
          </button>
        )}
      </div>
    </section>
  );
}
