import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import { Link } from "react-router";
import { LuEye, LuHeart, LuStar, LuTv } from "react-icons/lu";
import { useState } from "react";
import {EllipsisVertical} from 'lucide-react'

interface CharacterCardProps {
  imageUrl: string;
  name: string;
  role: string;
  animeAppearances?: number;
  hreflink: string;
  popularity?: number;
  favorites?: number;
}

export default function CharacterCard({
  imageUrl,
  name,
  role,
  animeAppearances = 0,
  hreflink,
  popularity,
  favorites,
}: CharacterCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [showMobileActions, setShowMobileActions] = useState(false);

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'main':
        return 'bg-primary text-primary-foreground';
      case 'supporting':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="relative w-full p-0 h-80 overflow-hidden group transition-all duration-500  hover:shadow-2xl hover:shadow-secondary/20 border-0 bg-gradient-to-br from-card/60 to-card/90 backdrop-blur-sm">
     
      <img
        src={imageUrl || "https://dummyimage.com/400x400"}
        alt={name}
        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
        loading="lazy"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-50 group-hover:opacity-90 transition-opacity duration-300" />

      {/* Role Badge */}
      <Badge 
        className={`absolute top-3 left-3 ${getRoleColor(role)} border-0 backdrop-blur-md shadow-lg transform -translate-y-2 group-hover:translate-y-0 transition-all duration-300 font-medium`}
      >
        {role}
      </Badge>

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

      {/* Stats Badges - Desktop */}
      <div className="absolute top-3 right-3 hidden md:flex flex-col gap-2 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
        {animeAppearances > 0 && (
          <Badge variant="secondary" className="backdrop-blur-md shadow-lg text-xs">
            <LuTv className="w-3 h-3 mr-1" />
            {animeAppearances}
          </Badge>
        )}
        {favorites && (
          <Badge variant="outline" className="backdrop-blur-md shadow-lg text-xs bg-white/10 border-white/20 text-white">
            <LuStar className="w-3 h-3 mr-1" />
            {favorites > 1000 ? `${(favorites / 1000).toFixed(1)}k` : favorites}
          </Badge>
        )}
      </div>

      {/* Desktop Action Buttons (hover) */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-150 max-md:hidden">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="default" size="icon" asChild className="rounded-full h-12 w-12 backdrop-blur-md shadow-xl hover:scale-110 transition-transform">
              <Link to={hreflink}>
                <LuEye className="w-5 h-5" />
                <span className="sr-only">View Details</span>
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View Character Details</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="icon" 
              variant={isFavorited ? "default" : "secondary"} 
              className="rounded-full h-10 w-10 backdrop-blur-md shadow-lg hover:scale-110 transition-all"
              onClick={(e) => {
                e.preventDefault();
                setIsFavorited(!isFavorited);
              }}
            >
              <LuHeart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
              <span className="sr-only">Add to Favorites</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Mobile Action Buttons (toggle) */}
      {showMobileActions && (
        <div className="absolute top-12 right-3 md:hidden flex flex-col gap-2 bg-black/80 backdrop-blur-md rounded-lg p-2 shadow-xl">
          <Button variant="default" size="sm" asChild className="rounded-lg">
            <Link to={hreflink}>
              <LuEye className="w-4 h-4 mr-2" />
              View
            </Link>
          </Button>
          
          <Button 
            size="sm" 
            variant={isFavorited ? "default" : "secondary"} 
            className="rounded-lg"
            onClick={(e) => {
              e.preventDefault();
              setIsFavorited(!isFavorited);
            }}
          >
            <LuHeart className={`w-4 h-4 mr-2 ${isFavorited ? 'fill-current' : ''}`} />
            {isFavorited ? 'Liked' : 'Like'}
          </Button>

          {/* Stats in mobile menu */}
          {(animeAppearances > 0 || favorites) && (
            <div className="flex flex-col gap-1 pt-2 border-t border-white/20">
              {animeAppearances > 0 && (
                <div className="text-xs text-white/70 flex items-center">
                  <LuTv className="w-3 h-3 mr-1" />
                  {animeAppearances} anime{animeAppearances !== 1 ? 's' : ''}
                </div>
              )}
              {favorites && (
                <div className="text-xs text-white/70 flex items-center">
                  <LuStar className="w-3 h-3 mr-1" />
                  {favorites > 1000 ? `${(favorites / 1000).toFixed(1)}k` : favorites} favorites
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Character Info Overlay */}
      <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 to-transparent transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
        <h3 className="text-white font-bold text-sm line-clamp-2 leading-tight mb-2">
          {name}
        </h3>
        
        <div className="flex items-center justify-between text-xs text-gray-300 opacity-0 group-hover:opacity-100 md:group-hover:opacity-100 opacity-100 md:opacity-0 transition-opacity duration-300 delay-200">
          <div className="flex items-center gap-2">
            {popularity && (
              <span>Rank #{popularity}</span>
            )}
          </div>
          {animeAppearances > 0 && (
            <span className="md:hidden">{animeAppearances} anime{animeAppearances !== 1 ? 's' : ''}</span>
          )}
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-r from-primary via-secondary to-primary blur-xl" />
    </Card>
  );
}
