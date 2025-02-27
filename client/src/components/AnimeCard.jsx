import { Link } from "react-router-dom";

const AnimeCard = ({ name, description, imageUrl, rating, href }) => {
  return (
    <div className="relative h-96 w-72 overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl">
      {/* Card Image */}
      <img
        src={imageUrl || `https://dummyimage.com/300x400`}
        alt={name}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100 p-4 flex flex-col justify-end">
        {/* Rating */}
        <div className="absolute top-4 left-4 bg-cyan-500 px-3 py-1 rounded-full text-sm font-bold text-white shadow-md">
          ★ {rating}
        </div>

        {/* Anime Name */}
        <h2 className="text-xl font-bold text-white">{name}</h2>

        {/* Description */}
        <p className="mt-2 text-sm text-gray-300 line-clamp-3">{description}</p>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-2">
          <Link to={href} className="flex-1">
            <button className="w-full rounded-lg  cursor-pointer bg-cyan-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-cyan-600">
              More Details
            </button>
          </Link>
          <button className="rounded-lg cursor-pointer bg-gray-800/80 px-3 py-2 text-white transition-all hover:bg-gray-700">
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnimeCard;
