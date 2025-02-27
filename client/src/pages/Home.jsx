import React from 'react'
import Carousal from '../components/Carousal'
import TrendingAnime from '../components/TrendingAnime'
import HighestRated from '../components/HighestRated'
const Home = () => {
  return (
    <div>
      <Carousal/>
      <TrendingAnime/>
      <HighestRated/>
    </div>
  )
}

export default Home