import { Link } from "react-router";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";

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
    <Card className="relative w-full h-96 overflow-hidden group cursor-pointer">
      <div className="absolute inset-0">
        <img
          src={backgroundImage}
          alt={`${title} background`}
          className="blur-sm brightness-50 object-cover size-full"
        />
      </div>

      <CardContent className="relative flex flex-col items-center justify-center h-full p-6">
        <div className="flex items-end space-x-[-20px] mb-4">
          {thumbnailImages.slice(0, 3).map((img, index) => (
            <div
              key={index}
              className={`w-20 h-32 rounded-lg shadow-lg overflow-hidden transition-transform group-hover:scale-105 ${
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
                className="object-cover h-full"
              />
            </div>
          ))}
        </div>

        <CardTitle className="text-center mb-4">{title}</CardTitle>

        <Button asChild variant="secondary" size="sm">
          <Link to={hreflink}>View Collection</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
