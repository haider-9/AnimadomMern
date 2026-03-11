import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Link } from "react-router";
import { LuPlay,  LuStar, LuHeart, LuBookmark,  } from "react-icons/lu";
import { useState } from "react";
import { EllipsisVertical } from "lucide-react";

interface AnimeCardProps {
  imageUrl: string;
  title: string;
  hreflink: string;
  score?: number;
  year?: number;
  episodes?: number;
  status?: string;
  genres?: string[];
}

export default function AnimeCard({
  imageUrl,
  title,
  hreflink,
  score = 0,
  year,
  episodes,
  status,
  genres = [],
}: AnimeCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showMobileActions, setShowMobileActions] = useState(false);

  return (
    <Card className="relative w-full p-0 h-80 overflow-hidden group transition-all duration-500  hover:shadow-2xl hover:shadow-primary/20 border-0 bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <img
        src={imageUrl || "https://dummyimage.com/500x500"}
        alt={title}
        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
        loading="lazy"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

      {/* Score Badge */}
      {score > 0 && (
        <Badge 
          variant="default" 
          className="absolute top-3 left-3 bg-primary/90 text-primary-foreground border-0 backdrop-blur-md shadow-lg transform -translate-y-2 group-hover:translate-y-0 transition-all duration-300"
        >
          <LuStar className="w-3 h-3 mr-1 fill-current" />
          {score.toFixed(1)}
        </Badge>
      )}

      {/* Status Badge */}
      {status && (
        <Badge 
          variant={status === "Currently Airing" ? "default" : "secondary"}
          className="absolute top-3 right-3 backdrop-blur-md shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-75"
        >
          {status}
        </Badge>
      )}

      {/* Mobile Actions Toggle */}
      <Button
        variant="secondary"
        size="icon"
        className="absolute top-3 right-3 md:hidden backdrop-blur-md shadow-lg h-8 w-8 rounded-full"
        onClick={(e) => {
          e.preventDefault();
          setShowMobileActions(!showMobileActions);
        }}
      >
        <EllipsisVertical className="w-4 h-4" />
      </Button>

      {/* Desktop Action Buttons (hover) */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-150 max-md:hidden">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="default" size="icon" asChild className="rounded-full h-12 w-12 backdrop-blur-md shadow-xl hover:scale-110 transition-transform">
              <Link to={hreflink}>
                <LuPlay className="w-5 h-5" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Watch Now</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="icon" 
              variant={isLiked ? "default" : "secondary"} 
              className="rounded-full h-10 w-10 backdrop-blur-md shadow-lg hover:scale-110 transition-all"
              onClick={(e) => {
                e.preventDefault();
                setIsLiked(!isLiked);
              }}
            >
              <LuHeart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isLiked ? 'Remove from Favorites' : 'Add to Favorites'}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="icon" 
              variant={isBookmarked ? "default" : "secondary"} 
              className="rounded-full h-10 w-10 backdrop-blur-md shadow-lg hover:scale-110 transition-all"
              onClick={(e) => {
                e.preventDefault();
                setIsBookmarked(!isBookmarked);
              }}
            >
              <LuBookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isBookmarked ? 'Remove from Watchlist' : 'Add to Watchlist'}</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Mobile Action Buttons (toggle) */}
      {showMobileActions && (
        <div className="absolute top-12 right-3 md:hidden flex flex-col gap-2 bg-black/80 backdrop-blur-md rounded-lg p-2 shadow-xl">
          <Button variant="default" size="sm" asChild className="rounded-lg">
            <Link to={hreflink}>
              <LuPlay className="w-4 h-4 mr-2" />
              Watch
            </Link>
          </Button>
          
          <Button 
            size="sm" 
            variant={isLiked ? "default" : "secondary"} 
            className="rounded-lg"
            onClick={(e) => {
              e.preventDefault();
              setIsLiked(!isLiked);
            }}
          >
            <LuHeart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
            {isLiked ? 'Liked' : 'Like'}
          </Button>

          <Button 
            size="sm" 
            variant={isBookmarked ? "default" : "secondary"} 
            className="rounded-lg"
            onClick={(e) => {
              e.preventDefault();
              setIsBookmarked(!isBookmarked);
            }}
          >
            <LuBookmark className={`w-4 h-4 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
            {isBookmarked ? 'Saved' : 'Save'}
          </Button>
        </div>
      )}

      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 to-transparent transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
        <h3 className="text-white font-bold text-sm line-clamp-2 leading-tight mb-2">
          {title}
        </h3>
        
        <div className="flex items-center justify-between text-xs text-gray-300">
          <div className="flex items-center gap-2">
            {year && <span>{year}</span>}
            {episodes && <span>• {episodes} eps</span>}
          </div>
        </div>

        {/* Genres */}
        {genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2 opacity-0 group-hover:opacity-100 md:group-hover:opacity-100 opacity-100 md:opacity-0 transition-opacity duration-300 delay-200">
            {genres.slice(0, 2).map((genre, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs py-0 px-2 bg-white/10 border-white/20 text-white hover:bg-white/20 transition-colors"
              >
                {genre}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
