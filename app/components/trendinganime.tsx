import AnimeCard from "./animecard";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Link } from "react-router";

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

  useEffect(() => {
    const fetchTrendingAnime = async () => {
      try {
        const query = `
          query {
            Page(page: 1, perPage: 10) {
              media(type: ANIME, sort: TRENDING_DESC) {
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
          body: JSON.stringify({ query }),
        });

        const data = await response.json();
        setTrendingAnime(data.data.Page.media);
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold px-4">Trending Now</h2>
        <Link to="/trending">
          <Button variant="default" size="sm">
            See All
          </Button>
        </Link>
      </div>
      <div className="flex flex-wrap max-md:justify-center justify-center gap-4 md:w-[95%] mx-auto">
        {trendingAnime.map((anime) => (
          <AnimeCard
            key={anime.idMal}
            title={anime.title.english || anime.title.romaji}
            imageUrl={anime.coverImage.large}
            hreflink={`/anime/${anime.idMal}`}
            score={anime.averageScore / 10}
          />
        ))}
      </div>
    </section>
  );
}
