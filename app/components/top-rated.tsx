import AnimeCard from "./animecard";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import Loading from "../components/loader";
import { Button } from "~/components/ui/button";

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
export default function TrendingAnime() {
  const [trendingAnime, setTrendingAnime] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrendingAnime = async () => {
      try {
        const response = await fetch(
          "https://api.jikan.moe/v4/top/anime?limit=20"
        );
        const data = await response.json();
        setTrendingAnime(data.data);
      } catch (err) {
        setError("Failed to fetch trending anime");
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingAnime();
  }, []);

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }
  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <section className="py-8">
        <div className="flex items-center justify-between mb-6 px-4">
          <h2 className="text-2xl font-bold">Top Rated Anime</h2>
          <Button asChild>
            <Link to="/top-rated">See All</Link>
          </Button>
        </div>
        <div className="flex flex-wrap gap-4 justify-center mx-auto">
          {trendingAnime.map((anime) => (
            <div className="flex-shrink-0" key={anime.mal_id}>
              <AnimeCard
                key={anime.mal_id}
                title={anime.title}
                imageUrl={anime.images.jpg.large_image_url}
                hreflink={`/anime/${anime.mal_id}`}
                score={anime.score}
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
