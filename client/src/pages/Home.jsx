import Carousal from "../components/Carousal";
import TrendingAnime from "../components/TrendingAnime";
import HighestRated from "../components/HighestRated";
import CollectionCard from "../components/CollectionCard";
const Home = () => {

  return (
    <div>
      <Carousal />
      <CollectionCard />
      <TrendingAnime />
      <HighestRated />
    </div>
  );
};

export default Home;
