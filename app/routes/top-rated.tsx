import { useEffect, useState } from "react";
import AnimeCard from "../components/animecard";
import { Button } from "~/components/ui/button";
import Loading from "~/components/loader";

interface Anime {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      large_image_url: string;
    };
  };
  score: number;
}

export default function TopRated() {
  const [topAnime, setTopAnime] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const fetchTopAnime = async () => {
      try {
        const response = await fetch(`https://api.jikan.moe/v4/top/anime?page=${currentPage}`);
        const data = await response.json();
        setTopAnime(data.data);
        setTotalPages(Math.ceil(data.pagination.items.total / data.pagination.items.per_page));
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching top anime:", error);
        setIsLoading(false);
      }
    };

    fetchTopAnime();
  }, [currentPage]);

  if (isLoading) {
    return (
      <Loading/>
    );
  }

  return (
    <>
    <title>Top Rated Anime</title>
    <div className="min-h-screen ">
      <h1 className="mb-8 text-3xl font-bold">Top Rated Anime</h1>
      <div className="flex flex-wrap justify-center gap-4">
        {topAnime.map((anime) => (
          <AnimeCard
            key={anime.mal_id}
            imageUrl={anime.images.jpg.large_image_url}
            title={anime.title}
            hreflink={`/anime/${anime.mal_id}`}
            score={anime.score}
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

          {[...Array(totalPages)].map((_, index) => {
            if (
              index === 0 ||
              index === totalPages - 1 ||
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
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
    </>
  );
}
