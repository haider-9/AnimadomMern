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
    <div className="flex-shrink-0 w-[180px] sm:w-[200px] md:w-[250px]">
      <div
        className="group relative w-full h-[250px] sm:h-[350px] rounded-lg overflow-hidden shadow-lg 
      cursor-pointer"
      >
        <img
          src={imageUrl || "https://dummyimage.com/500x500"}
          alt={title}
          className="size-full object-cover object-center transition-all duration-500 ease-in-out group-hover:blur-[2px] group-hover:scale-105"
        />

        {/* Score Badge */}
        <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded-md text-xs text-yellow-500 inline-flex items-center gap-1">
          <LuStar className="w-3 h-3" /> {score}
        </div>

        {/* Hover Overlay */}
        <div className="px-2 py-3 absolute opacity-0 group-hover:opacity-100 inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent flex flex-col justify-end translate-y-6 transition-all duration-500 ease-in-out group-hover:translate-y-0">
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
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-2 py-1"
            >
              <Link to={hreflink}>
                <LuPlay className="w-3 h-3" />
                Learn More
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
