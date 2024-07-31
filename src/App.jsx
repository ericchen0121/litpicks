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
    <div className='flex flex-col w-full h-screen ml-8 mb-12 items-start justify-start'>
      <div className='mb-8 mt-8'>
        <MLBSchedule
          setSelectedGame={setSelectedGame}
          selectedGame={selectedGame}
        />
      </div>
      <div className='mb-16 flex flex-row items-center justify-start'>
        <div className='mr-24'>
          <PitcherStatsHeader
            pitcherInfo={selectedGame?.teams?.away?.probablePitcher}
            teamId={selectedGame?.teams?.away?.team?.id}
          />
          <PitcherStats
            playerId={selectedGame?.teams?.away?.probablePitcher?.id}
          />
        </div>
        <div>
          <TeamHittingStats
            teamId={selectedGame?.teams?.home?.team?.id}
            vsHand={selectedGame?.teams?.away?.probablePitcher?.pitchHand?.code}
          />
        </div>
      </div>
      <div className='flex flex-row items-center justify-start'>
        <div className='mr-24'>
          <PitcherStatsHeader
            pitcherInfo={selectedGame?.teams?.home?.probablePitcher}
            teamId={selectedGame?.teams?.home?.team?.id}
          />
          <PitcherStats
            playerId={selectedGame?.teams?.home?.probablePitcher?.id}
          />
        </div>
        <div>
          <TeamHittingStats
            teamId={selectedGame?.teams?.away?.team?.id}
            vsHand={selectedGame?.teams?.home?.probablePitcher?.pitchHand?.code}
          />
        </div>
      </div>
    </div>
  )
}

export default App
