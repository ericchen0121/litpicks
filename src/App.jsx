import { useState } from 'react'
import {
  MLBSchedule,
  PitcherStats,
  PitcherStatsHeader,
  TeamHittingStats,
} from './components'
import './app/globals.css'

function App() {
  const [selectedGame, setSelectedGame] = useState({})

  return (
    <div className='flex flex-col w-full h-full ml-8'>
      <div className='mb-8 mt-8'>
        <MLBSchedule
          setSelectedGame={setSelectedGame}
          selectedGame={selectedGame}
        />
      </div>
      <div className='mb-4'>
        <div className='text-med'>Team Hitting Ranks</div>
        <TeamHittingStats
          teamId={selectedGame?.teams?.away?.team?.id}
          vsHand={selectedGame?.teams?.home?.probablePitcher?.pitchHand?.code}
        />
        <TeamHittingStats
          teamId={selectedGame?.teams?.home?.team?.id}
          vsHand={selectedGame?.teams?.away?.probablePitcher?.pitchHand?.code}
        />
      </div>
      <div className='mb-4'>
        <PitcherStatsHeader
          pitcherInfo={selectedGame?.teams?.away?.probablePitcher}
        />
        <PitcherStats
          playerId={selectedGame?.teams?.away?.probablePitcher?.id}
        />
      </div>
      <div className='mb-12'>
        <PitcherStatsHeader
          pitcherInfo={selectedGame?.teams?.home?.probablePitcher}
        />
        <PitcherStats
          playerId={selectedGame?.teams?.home?.probablePitcher?.id}
        />
      </div>
    </div>
  )
}

export default App
