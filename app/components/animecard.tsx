import { Button } from "./ui/button";
import { Link } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import React from "react";
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
    <div className="w-40 sm:w-56 md:w-72">
      <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden shadow-xl group bg-gradient-to-br from-zinc-900/80 to-zinc-800/60">
        {/* Anime Image */}
        <img
          src={imageUrl || "https://dummyimage.com/500x500"}
          alt={title}
          className="w-full h-full object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Glassmorphic Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent backdrop-blur-[2px] group-hover:backdrop-blur-[4px] transition-all duration-300" />

        {/* Floating Score Badge */}
        <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm text-yellow-400 flex items-center gap-2 shadow-lg border border-white/30">
          <LuStar className="w-5 h-5 text-yellow-400 drop-shadow" />
          <span className="font-bold text-yellow-400 tracking-wide">{score}</span>
        </div>

        {/* Vertical Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <Button
            variant="default"
            size="sm"
            asChild
            className="bg-purple-600/90 hover:bg-purple-700 text-white rounded-full p-2 shadow-lg flex items-center justify-center"
            title="Learn More"
          >
            <Link to={hreflink}>
              <LuPlay className="w-5 h-5" />
            </Link>
          </Button>
          <div className="relative group/add">
            <Button
              size="sm"
              className="rounded-full p-2 bg-white/80 hover:bg-white text-purple-700 shadow-lg"
              aria-label="Add to List"
            >
              <LuPlus className="w-5 h-5" />
            </Button>
            <div className="absolute right-0 mt-2 z-20 min-w-[10rem] bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-zinc-200 opacity-0 group-hover/add:opacity-100 pointer-events-none group-hover/add:pointer-events-auto transition-opacity duration-200 flex flex-col overflow-hidden">
              <button className="px-4 py-2 text-left hover:bg-zinc-100 text-zinc-800 text-sm">Add to Watchlist</button>
              <button className="px-4 py-2 text-left hover:bg-zinc-100 text-zinc-800 text-sm">Add to Favorites</button>
              <button className="px-4 py-2 text-left hover:bg-zinc-100 text-zinc-800 text-sm">Add to Custom List</button>
            </div>
          </div>
        </div>

        {/* Title at Bottom with Glass Effect */}
        <div className="absolute bottom-0 left-0 w-full px-4 py-3 bg-white/20 backdrop-blur-md rounded-t-xl flex flex-col items-start">
          <h3 className="text-white font-extrabold text-lg drop-shadow mb-1 line-clamp-2 w-full">
            {title}
          </h3>
        </div>
      </div>
    </div>
  );
}
