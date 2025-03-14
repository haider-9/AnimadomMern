import { Link } from "react-router";

interface CollectionCardProps {
  title: string;
  backgroundImage?: string;
  thumbnailImages?: string[];
  hreflink?: string;
}

export default function CollectionCard({
  title = "Collection Title",
  backgroundImage = "https://dummyimage.com/600x400/000/fff&text=Background",
  thumbnailImages = [
    "https://dummyimage.com/900x1600/333/fff&text=1",
    "https://dummyimage.com/100x150/666/fff&text=2",
    "https://dummyimage.com/100x150/999/fff&text=3",
  ],
  hreflink,
}: CollectionCardProps) {
  return (
    <div className="relative border w-[320px] h-[420px] cursor-pointer overflow-hidden rounded-3xl shadow-xl bg-black/30 group">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={backgroundImage}
          alt={`${title} background`}
          className=" blur-[1px] brightness-50 object-cover object-center size-full"
        />
      </div>

      {/* Card Content */}
      <div className="relative flex flex-col items-center justify-center h-full ">
        <div className="flex items-end space-x-[-20px] mb-4">
          {thumbnailImages.slice(0, 3).map((img, index) => (
            <div
              key={index}
              className={`w-[90px] h-[140px] rounded-lg shadow-lg overflow-hidden transition-transform duration-300 ease-out group-hover:scale-110 ${
                index === 0
                  ? "rotate-[-10deg]"
                  : index === 2
                  ? "rotate-[10deg]"
                  : ""
              }`}
            >
              <img
                src={img}
                alt={`${title} thumbnail ${index + 1}`}
                className="object-cover h-full object-center"
              />
            </div>
          ))}
        </div>

        {/* Title & Item Count */}
        <h3 className="text-lg font-semibold text-white text-center">
          {title}
        </h3>

        <Link to={hreflink}>
          <button className="mt-2 px-4 py-2 bg-white/20 text-white cursor-pointer rounded-lg backdrop-blur-md hover:bg-white/30 transition">
            View Collection
          </button>
        </Link>
      </div>
    </div>
  );
}
