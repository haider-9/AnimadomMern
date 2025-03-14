import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import AnimeCard from "./animecard";
import Loader from "./loader";
interface AnimeData {
  id: number;
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

const Collections: React.FC = () => {
  const [animeList, setAnimeList] = useState<AnimeData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const randomPage = Math.floor(Math.random() * 100) + 1;

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const query = `
          query ($randomPage: Int) {
            Page(page: $randomPage, perPage: 100) {
              media(type: ANIME, sort:SCORE_DESC ) {
            idMal
                title {
                  romaji
                  english
                }
                coverImage {
                  large
                }
                averageScore
              }
            }
          }
        `;

        const response = await fetch("https://graphql.anilist.co", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            query,
            variables: {
              randomPage,
            },
          }),
        });

        const data = await response.json();

        if (data.errors) {
          throw new Error(data.errors[0].message);
        }

        const allAnime = data.data.Page.media;
        const shuffled = [...allAnime].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 10);

        setAnimeList(selected);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching anime:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch anime");
        setLoading(false);
      }
    };

    fetchAnime();
  }, []);
  if (loading) {
    return <Loader/>
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4 text-white">
        Random Anime
      </h2>
      <div
        className="w-full overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <Marquee
          speed={40}
          pauseOnHover={false}
          play={!isPaused}
          gradient={false}
        >
          <div className="flex gap-4  px-4">
            {animeList.map((anime) => (
              <div
                key={anime.id}
                className="flex-shrink-0 overflow-hidden rounded-xl"
              >
                <AnimeCard
                  imageUrl={anime.coverImage.large}
                  title={anime.title.english || anime.title.romaji}
                  hreflink={`/anime/${anime.idMal}`}
                  score={anime.averageScore / 10}
                />
              </div>
            ))}
          </div>
        </Marquee>
      </div>
    </div>
  );
};

export default Collections;
