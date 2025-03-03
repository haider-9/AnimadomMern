import AnimeCard from "../components/AnimeCard";
import { useEffect, useState } from "react";

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
        const response = await fetch("https://api.jikan.moe/v4/top/anime?limit=20");
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

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-6 px-4">Top Rated Anime</h2>
      <div className="flex flex-wrap gap-4 mx-auto">
        {trendingAnime.map((anime) => (
          <AnimeCard
            key={anime.mal_id}
            title={anime.title}
            imageUrl={anime.images.jpg.large_image_url}
            hreflink={`/anime/${anime.mal_id}`}
            score={anime.score}
          />
        ))}
      </div>
    </section>
  );
}