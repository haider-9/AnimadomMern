import React, { useEffect, useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
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
  const controls = useAnimation();
  const progressRef = useRef(0);
  const startTimeRef = useRef<number>(Date.now());
  const scrollDirection = useRef<"left" | "right">("left");

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
            variables: { page: Math.floor(Math.random() * 10) + 1, perPage: 50 },
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

  useEffect(() => {
    if (!isPaused) {
      startAnimation();
    } else {
      controls.stop();
    }
  }, [isPaused, controls]);

  const startAnimation = () => {
    const direction = scrollDirection.current;
    controls.start({
      x: direction === "left" ? "-100%" : "0%",
      transition: { 
        duration: 40, 
        repeat: Infinity, 
        ease: "linear",
        from: direction === "left" ? "0%" : "-100%"
      },
    });
    startTimeRef.current = Date.now();
  };

  const handlePause = () => {
    setIsPaused(true);
    controls.stop();
    const elapsedTime = Date.now() - startTimeRef.current;
    const duration = 40 * 1000;
    progressRef.current = (elapsedTime % duration) / duration;
  };

  const handleResume = () => {
    setIsPaused(false);
    startAnimation();
  };

  const handleScrollLeft = () => {
    handlePause();
    scrollDirection.current = "right";
    handleResume();
  };

  const handleScrollRight = () => {
    handlePause();
    scrollDirection.current = "left";
    handleResume();
  };

  const handleMouseEnter = () => {
    handlePause();
  };

  const handleMouseLeave = () => {
    handleResume();
  };

  const duplicatedAnimeList = [...animeList, ...animeList];

  return (
    <div className="relative w-full py-8 overflow-hidden">
      <div className="flex justify-between items-center px-6 pb-4">
        <h2 className="text-2xl font-bold">Random Anime</h2>
        <div className="flex gap-2">
          <Button 
            onClick={handleScrollLeft} 
            variant="outline" 
            className="text-xl"
            aria-label="Scroll left"
          >
            &#60;
          </Button>
          <Button 
            onClick={handleScrollRight} 
            variant="outline" 
            className="text-xl"
            aria-label="Scroll right"
          >
            &#62;
          </Button>
        </div>
      </div>
      <motion.div
        className="flex gap-4"
        animate={controls}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {duplicatedAnimeList.map((anime, index) => (
          <motion.div key={`${anime.id}-${index}`} className="flex-shrink-0 overflow-hidden rounded-xl">
            <AnimeCard imageUrl={anime.imageUrl} title={anime.title} hreflink={anime.hreflink} score={anime.score} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
