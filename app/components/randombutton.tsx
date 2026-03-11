import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { useNavigate, useLocation } from "react-router";
import { Loader2, Shuffle } from "lucide-react";
import { API_ENDPOINTS } from "~/constants";
import { useErrorHandler } from "~/hooks/use-error-handler";

export default function RandomButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("Searching");
  const navigate = useNavigate();
  const location = useLocation();
  const handleError = useErrorHandler({
    toastMessage: "Failed to get random anime. Please try again.",
  });

  // Reset loading state when location changes
  useEffect(() => {
    setIsLoading(false);
  }, [location.pathname]);

  // Animate search text
  useEffect(() => {
    if (!isLoading) return;

    const texts = ["Searching", "Searching.", "Searching..", "Searching..."];
    let index = 0;

    const interval = setInterval(() => {
      setSearchText(texts[index]);
      index = (index + 1) % texts.length;
    }, 300);

    return () => clearInterval(interval);
  }, [isLoading]);

  const handleClick = async () => {
    setIsLoading(true);

    try {
      // Add a minimum delay to show the searching state
      const [response] = await Promise.all([
        fetch(`${API_ENDPOINTS.JIKAN}/random/anime?t=${Date.now()}`),
        new Promise(resolve => setTimeout(resolve, 800)) // Minimum 800ms delay
      ]);

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();

      if (data.data && data.data.mal_id) {
        // Keep loading state active during navigation
        navigate(`/anime/${data.data.mal_id}`);
        // Don't set loading to false here - let it stay active until page loads
      } else {
        throw new Error("Invalid data received from API");
      }
    } catch (error) {
      handleError(error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size={"sm"}
      onClick={handleClick}
      disabled={isLoading}
      className="gap-2"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {searchText}
        </>
      ) : (
        <>
          <Shuffle className="h-4 w-4" />
          Random Anime
        </>
      )}
    </Button>
  );
}
