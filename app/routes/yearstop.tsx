import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AnimeCard from '../components/animecard'
import { Button } from '~/components/ui/button'
import Loading from '~/components/loader'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"

export default function YearsTop() {
  const [topAnime, setTopAnime] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 40 }, (_, i) => currentYear - i)
  const seasons = ['WINTER', 'SPRING', 'SUMMER', 'FALL']
  
  const [activeYear, setActiveYear] = useState(currentYear)
  const [activeSeason, setActiveSeason] = useState(getCurrentSeason())

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }

  useEffect(() => {
    const fetchTopAnime = async () => {
      try {
        setLoading(true)
        
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
        `
        
        const variables = {
          season: activeSeason,
          seasonYear: activeYear,
          page: currentPage,
          perPage: 12
        }
        
        const response = await fetch('https://graphql.anilist.co', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            query,
            variables
          })
        })
        
        const data = await response.json()
        setTopAnime(data.data.Page.media)
        setTotalPages(data.data.Page.pageInfo.lastPage)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch top anime')
        setLoading(false)
      }
    }

    fetchTopAnime()
  }, [activeYear, activeSeason, currentPage])

  function getCurrentSeason() {
    const month = new Date().getMonth() + 1
    if (month >= 3 && month <= 5) return 'SPRING'
    if (month >= 6 && month <= 8) return 'SUMMER'
    if (month >= 9 && month <= 11) return 'FALL'
    return 'WINTER'
  }

  if (loading) return <Loading />
  if (error) return <div className="text-destructive">{error}</div>

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
              onValueChange={(value) => setActiveYear(parseInt(value))}
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
                onClick={() => setActiveSeason(season)}
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
          className="flex flex-wrap justify-center gap-4"
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
