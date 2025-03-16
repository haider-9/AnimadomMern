import { useState } from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";

export default function RandomButton() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleClick = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/random/anime?t=${Date.now()}`
      );

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();

      if (data.data && data.data.mal_id) {
        navigate(`/anime/${data.data.mal_id}`);
      } else {
        throw new Error("Received invalid data from API");
      }
    } catch (error) {
      console.error("Error fetching random anime:", error);
      toast.error("Failed to get random anime. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size={"sm"}
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? "Loading..." : "Random Anime"}
    </Button>
  );
}
