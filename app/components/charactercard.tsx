import { Button } from "~/components/ui/button";
import { Link } from "react-router";

interface CharacterCardProps {
  imageUrl: string;
  name: string;
  role: string;
  animeAppearances?: number;
  hreflink: string;
}

export default function CharacterCard({
  imageUrl,
  name,
  role,
  animeAppearances = 0,
  hreflink,
}: CharacterCardProps) {
  return (
    <div className="group relative sm:w-[250px] w-[185px] h-[250px] sm:h-[350px] rounded-3xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-black/40 z-10" />

      <img
        src={imageUrl || "https://dummyimage.com/400x400"}
        alt={name}
        className="w-full h-full object-cover object-center transition-all duration-500 ease-in-out group-hover:scale-110"
      />

      {/* Role badge */}
      <div className="absolute top-3 left-3  bg-black/90 px-3 py-1 rounded-full z-20">
        <span className="text-sm font-semibold text-primary">{role}</span>
      </div>

      {/* Appearances counter */}
      <div className="absolute top-3 right-3  bg-black/90 px-2 py-1 rounded-full z-20">
        <span className="text-sm font-medium">📺 {animeAppearances}</span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent z-20">
        <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
          {name}
        </h3>

        <div className="flex gap-2">
          <Link to={hreflink} className="flex-1">
            <Button
              variant="default"
              size="sm"
              className="w-full bg-primary/90 hover:bg-primary transition-all duration-300"
            >
              View Details
            </Button>
          </Link>
          <Button variant="secondary" size="sm" className="aspect-square">
            ♥
          </Button>
        </div>
      </div>
    </div>
  );
}
