import { Button } from "./ui/button";
import { Link } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LuPlay, LuPlus, LuStar } from "react-icons/lu";

interface AnimeCardProps {
  imageUrl: string;
  title: string;
  hreflink: string;
  score?: number;
}

export default function AnimeCard({
  imageUrl,
  title,
  hreflink,
  score = 0,
}: AnimeCardProps) {
  return (
    <div className="w-[150px] sm:w-[200px] md:w-[250px]">
      <div className="relative w-full h-[250px] sm:h-[350px] rounded-lg overflow-hidden shadow-lg">
        <img
          src={imageUrl || "https://dummyimage.com/500x500"}
          alt={title}
          className="size-full object-cover object-center"
          loading="lazy"
        />

        {/* Score Badge */}
        <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded-md text-xs text-yellow-500 inline-flex items-center gap-1">
          <LuStar className="w-3 h-3" /> {score}
        </div>

        {/* Overlay */}
        <div className="px-2 py-3 absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent flex flex-col justify-end sm:opacity-0 sm:hover:opacity-100 transition-opacity duration-200">
          {/* Title */}
          <h3 className="text-white font-bold mb-2 text-sm line-clamp-2">
            {title}
          </h3>

          {/* Buttons */}
          <div className="flex justify-center gap-2">
            <Button
              variant="default"
              size="sm"
              asChild
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs"
            >
              <Link to={hreflink}>
                <LuPlay className="w-full h-3" />
                <span className="hidden sm:inline ml-1">Learn More</span>
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="rounded-full aspect-square p-1">
                  <LuPlus className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="*:cursor-pointer">
                <DropdownMenuItem>Add to Watchlist</DropdownMenuItem>
                <DropdownMenuItem>Add to Favorites</DropdownMenuItem>
                <DropdownMenuItem>Add to Custom List</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
