import AnimeCard from "../components/animecard";
import { useEffect, useState } from "react";
import Loading from "~/components/loader";
import { Button } from "~/components/ui/button";

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

  useEffect(() => {
    handlePageChange(currentPage);
  }, [currentPage]);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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
  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
    <title>Animadom | Upcoming Anime</title>
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
      <div className="mt-8 flex justify-center">
        <div className="flex items-center gap-2 overflow-x-auto px-4 py-2 max-w-[90vw]">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          {[...Array(50)].map((_, index) => {
            if (
              index === 0 ||
              index === 49 ||
              (index >= currentPage - 2 && index <= currentPage + 2)
            ) {
              return (
                <Button
                  key={index + 1}
                  variant={currentPage === index + 1 ? "default" : "outline"}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Button>
              );
            }
            // Show ellipsis for skipped pages
            if (index === currentPage - 3 || index === currentPage + 3) {
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
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!hasNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    </section>
    </>
  );
}
