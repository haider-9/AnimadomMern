import { Button } from "./ui/button";
import { Link } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LuBugPlay, LuPlay, LuPlus, LuStar } from "react-icons/lu";

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
    <Link to={hreflink} className="group relative w-[280px] h-[400px] rounded-lg overflow-hidden shadow-lg md:w-[250px] md:h-[360px] sm:w-[220px] sm:h-[320px] cursor-pointer">
      <img
        src={imageUrl || "https://dummyimage.com/500x500"}
        alt={title}
        className="w-full h-full object-cover object-center transition-all duration-500 ease-in-out group-hover:blur-[2px] group-hover:scale-105"
      />

      <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded-md text-sm text-yellow-500 inline-flex items-center gap-1">
        <LuStar/> {score}
      </div>

      <div className="px-3 py-5 absolute opacity-0 group-hover:opacity-100 inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent flex flex-col justify-end translate-y-6 transition-all duration-500 ease-in-out group-hover:translate-y-0 ">
        <h3 className="text-white font-bold mb-4 sm:opacity-100 text-base md:text-lg lg:text-xl opacity-0 transform -translate-y-4 transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:translate-y-0 line-clamp-2">
          {title}
        </h3>

        <div className="flex justify-center gap-4 sm:opacity-100 sm:translate-y-0 lg:flex opacity-0 transform translate-y-4 transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:translate-y-0">
          <Button
            variant="default"
            size="sm"
            asChild
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold grow"
          >
            <Link to={hreflink}>
              <LuPlay /> Learn More
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="rounded-full aspect-square">
                <LuPlus />
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
    </Link>
  );
}
