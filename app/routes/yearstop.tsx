import { useState } from 'react'
import { motion } from 'framer-motion'
import AnimeCard from '../components/animecard'
import { Button } from '~/components/ui/button'
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "~/components/ui/skeleton";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { API_ENDPOINTS } from "~/constants";
import type { Route } from "./+types/yearstop";
import { generateMeta } from "~/lib/seo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"

export function meta({}: Route.MetaArgs) {
  return generateMeta({
    title: "Top Anime by Year & Season",
    description: "Explore the best anime series organized by year and season. Discover top-rated anime from different time periods and seasonal releases.",
    keywords: "anime by year, seasonal anime, anime seasons, anime by decade, anime timeline, yearly anime rankings",
    url: "/topbyyear",
    canonical: "https://animadom.vercel.app/topbyyear",
  });
}

// Fetch function for TanStack Query
const fetchTopAnimeByYear = async (year: number, season: string, page: number) => {
  const query = `
    query ($season: MediaSeason, $seasonYear: Int, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          perPage
          currentPage
          lastPage
        }
        media(season: $season, seasonYear: $seasonYear, sort: POPULARITY_DESC, type: ANIME) {
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
  
  const variables = {
    season,
    seasonYear: year,
    page,
    perPage: 12
  };
  
  const response = await fetch(API_ENDPOINTS.ANILIST, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables
    })
  });
  
  if (!response.ok) throw new Error('Failed to fetch top anime');
  const data = await response.json();
  return data.data.Page;
};

function getCurrentSeason() {
  const month = new Date().getMonth() + 1
  if (month >= 3 && month <= 5) return 'SPRING'
  if (month >= 6 && month <= 8) return 'SUMMER'
  if (month >= 9 && month <= 11) return 'FALL'
  return 'WINTER'
}

export default function YearsTop() {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 40 }, (_, i) => currentYear - i)
  const seasons = ['WINTER', 'SPRING', 'SUMMER', 'FALL']
  
  const [activeYear, setActiveYear] = useState(currentYear)
  const [activeSeason, setActiveSeason] = useState(getCurrentSeason())
  const [currentPage, setCurrentPage] = useState(1)

  // TanStack Query for data fetching
  const { data, isLoading, error } = useQuery({
    queryKey: ["top-anime-by-year", activeYear, activeSeason, currentPage],
    queryFn: () => fetchTopAnimeByYear(activeYear, activeSeason, currentPage),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const topAnime = data?.media || [];
  const totalPages = data?.pageInfo?.lastPage || 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }

  const handleYearChange = (year: number) => {
    setActiveYear(year);
    setCurrentPage(1); // Reset to first page
  };

  const handleSeasonChange = (season: string) => {
    setActiveSeason(season);
    setCurrentPage(1); // Reset to first page
  };

  if (isLoading) {
    return (
      <div className="min-h-screen mt-3">
        <div className="container mx-auto px-6">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Skeleton className="h-10 w-full sm:w-1/3" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 justify-items-center">
            {[...Array(12)].map((_, i) => (
              <Skeleton key={i} className="h-80 w-48" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8">
        <Alert variant="destructive">
          <AlertDescription>Failed to load anime data. Please try again.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
    <title>Animadom | Years & Seasons</title>
    <div className="min-h-screen mt-3 theme-transition">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold mb-6">Top Anime by Year & Season</h1>
        
        {/* Year and Season Selection */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-card/80 p-4 rounded-xl sticky top-0 backdrop-blur-sm z-10 border border-border">
          {/* Year Combo Box */}
          <div className="w-full sm:w-1/3">
            <Select
              value={activeYear.toString()}
              onValueChange={(value) => handleYearChange(parseInt(value))}
            >
              <SelectTrigger className="w-full bg-secondary/50 border-border">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border max-h-[200px] overflow-y-auto">
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()} className="text-popover-foreground hover:bg-secondary/50">
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Season Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
            {seasons.map((season) => (
              <Button
                key={season}
                onClick={() => handleSeasonChange(season)}
                className={`
                  relative group flex items-center justify-center gap-2
                  ${
                    activeSeason === season
                      ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                      : "bg-secondary/30 text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  }
                `}
              >
                <span>{season.charAt(0) + season.slice(1).toLowerCase()}</span>
                {activeSeason === season && (
                  <motion.div
                    layoutId="activeSeasonTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}
              </Button>
            ))}
          </div>
        </div>

        <motion.div
          key={`${activeYear}-${activeSeason}-${currentPage}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 justify-items-center"
        >
          {topAnime.length > 0 ? (
            topAnime.map((anime) => (
              <AnimeCard
                key={anime.idMal}
                imageUrl={anime.coverImage.large}
                title={anime.title.english || anime.title.romaji}
                hreflink={`/anime/${anime.idMal}`}
                score={anime.averageScore / 10}
              />
            ))
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              No anime found for {activeSeason.toLowerCase()} {activeYear}
            </div>
          )}
        </motion.div>

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
                )
              }

              if (index === currentPage - 3 || index === currentPage + 3) {
                return (
                  <span key={index} className="text-muted-foreground">
                    ...
                  </span>
                )
              }

              return null
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
    </div>
    </>
  )
}
