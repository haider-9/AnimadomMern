import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import AnimeCard from "./animecard";
import { Button } from "./ui/button";

interface Anime {
  id: number;
  title: string;
  imageUrl: string;
  hreflink: string;
  score?: number;
}

export default function InfiniteAnimeScroll() {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("left");
  const [speed, setSpeed] = useState(40);

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const response = await fetch("https://graphql.anilist.co", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              query ($page: Int, $perPage: Int) {
                Page(page: $page, perPage: $perPage) {
                  media(type: ANIME) {
                    idMal
                    title { romaji }
                    coverImage { large }
                    siteUrl
                    averageScore
                  }
                }
              }
            `,
            variables: {
              page: Math.floor(Math.random() * 10) + 1,
              perPage: 50,
            },
          }),
        });
        const { data } = await response.json();
        const shuffledAnime = [...data.Page.media]
          .sort(() => Math.random() - 0.5)
          .map((anime: any) => ({
            id: anime.idMal || Math.random(),
            title: anime.title.romaji,
            imageUrl: anime.coverImage.large,
            hreflink: anime.siteUrl,
            score: anime.averageScore,
          }));
        setAnimeList(shuffledAnime);
      } catch (error) {
        console.error("Error fetching anime data:", error);
      }
    };
    fetchAnime();
  }, []);

  const handleScrollLeft = () => {
    setDirection("right");
  };

  const handleScrollRight = () => {
    setDirection("left");
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  return (
    <div className="relative w-full py-8 overflow-hidden">
      <div className="flex justify-between items-center px-6 pb-4">
        <h2 className="text-2xl font-bold">Random Anime</h2>
        <div className="flex gap-2">
          <Button
            onClick={handleScrollLeft}
            variant="outline"
            className="rounded-full"
            aria-label="Scroll left"
          >
            &#60;
          </Button>
          <Button
            onClick={handleScrollRight}
            variant="outline"
            className="rounded-full"
            aria-label="Scroll right"
          >
            &#62;
          </Button>
        </div>
      </div>

      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <Marquee
          speed={speed}
          direction={direction}
          pauseOnHover={false}
          play={!isPaused}
          gradient={false}
        >
          {animeList.map((anime, index) => (
            <div
              key={`${anime.id}-${index}`}
              className="flex-shrink-0 overflow-hidden rounded-xl mx-2 "
            >
              <AnimeCard
                imageUrl={anime.imageUrl}
                title={anime.title}
                hreflink={`anime/${anime.id}`}
                score={anime.score}
              />
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
}
