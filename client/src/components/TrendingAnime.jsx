import { useEffect, useState } from "react";
import AnimeCard from "./AnimeCard";

const TrendingAnime = () => {
  const [anime, setAnime] = useState([]);

  const query = `
    query {
        Page(page: 1, perPage: 8) {
            media(type: ANIME, sort: TRENDING_DESC) {
                idMal
                title {
                    english
                    romaji
                }
                coverImage {
                    large
                }
                episodes
                genres
                averageScore
            }
        }
    }
    `;

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const response = await fetch("https://graphql.anilist.co", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: query,
          }),
        });
        const data = await response.json();
        setAnime(data.data.Page.media);
      } catch (error) {
        console.error("Error fetching anime:", error);
      }
    };
    fetchAnime();
  }, []);

  return (
    <div className="container mx-auto py-12 px-4 md:px-8 lg:px-16 max-w-[1440px]">
      <h1 className="text-center text-4xl md:text-5xl font-bold mb-10 md:mb-16">
        Trending Anime
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12">
        {anime.map((anime) => (
          <div>
            <AnimeCard
              key={anime.idMal}
              name={anime.title.english || anime.title.romaji}
              imageUrl={anime.coverImage.large}
              rating={anime.averageScore}
              href={`/anime/${anime.idMal}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingAnime;
