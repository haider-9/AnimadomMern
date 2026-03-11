import React from "react";
import Marquee from "react-fast-marquee";
import AnimeCard from "./animecard";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "./ui/skeleton";
import { Alert, AlertDescription } from "./ui/alert";
import { API_ENDPOINTS } from "~/constants";
import { Progress } from "./ui/progress";

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

const fetchRandomAnime = async (): Promise<AnimeData[]> => {
  const randomPage = Math.floor(Math.random() * 100) + 1;
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

  const response = await fetch(API_ENDPOINTS.ANILIST, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { randomPage },
    }),
  });

  const data = await response.json();
  if (data.errors) {
    throw new Error(data.errors[0].message);
  }

  const allAnime = data.data.Page.media;
  const shuffled = [...allAnime].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 10);
};

const Collections: React.FC = () => {
  const [isPaused, setIsPaused] = React.useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = React.useState(0);

  const { data: animeList, isLoading, error } = useQuery({
    queryKey: ["random-anime-collection"],
    queryFn: fetchRandomAnime,
  });

  // Simulate loading progress
  React.useEffect(() => {
    if (isLoading) {
      const timer = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            return 100;
          }
          return prev + 10;
        });
      }, 100);
      return () => clearInterval(timer);
    } else {
      setLoadingProgress(100);
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="my-8">
        <Skeleton className="h-8 w-32 mb-4" />
        <div className="mb-4 px-4">
          <Progress value={loadingProgress} className="w-full" />
          <p className="text-sm text-muted-foreground mt-2">Loading anime collection...</p>
        </div>
        <div className="flex gap-4 px-4">
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="h-80 w-56 flex-shrink-0 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mx-4 my-8">
        <AlertDescription>Failed to fetch anime collection</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4 text-foreground px-4">For You</h2>
      <div
        className="w-full overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <Marquee speed={40} pauseOnHover={false} play={!isPaused} gradient={false}>
          <div className="flex gap-4 px-4">
            {animeList?.map((anime) => (
              <div key={anime.id} className="flex-shrink-0 w-56">
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
