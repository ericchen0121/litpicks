import { useState } from 'react'
import { MLBSchedule, PitcherStats, TeamHittingStats } from './components'
import './app/globals.css'

function App() {
  const [selectedGame, setSelectedGame] = useState({})
  console.log('selectedGame', selectedGame, selectedGame?.teams?.away?.team?.id)
  return (
    <div className='flex flex-col w-full h-full ml-8'>
      <div className='mb-8 mt-8'>
        <MLBSchedule
          setSelectedGame={setSelectedGame}
          selectedGame={selectedGame}
        />
      </div>
      <div className='mb-4'>
        <TeamHittingStats
          teamId={selectedGame?.teams?.away?.team?.id}
          vsHand={selectedGame?.teams?.away?.probablePitcher?.pitchHand?.code}
        />
      </div>
      <div className='mb-4'>
        <TeamHittingStats
          teamId={selectedGame?.teams?.home?.team?.id}
          vsHand={selectedGame?.teams?.home?.probablePitcher?.pitchHand?.code}
        />
      </div>
      <div className='mb-4'>
        <div className='flex flex-row items-center mb-2'>
          <img
            src={`https://midfield.mlbstatic.com/v1/people/${selectedGame?.teams?.away?.probablePitcher?.id}/spots/80`}
            className='w-10 mr-2'
          />
          <div className='mr-1'>
            {selectedGame?.teams?.away?.probablePitcher?.lastName}
          </div>
          <a
            href={`https://baseballsavant.mlb.com/savant-player/${selectedGame?.teams?.away?.probablePitcher?.firstName}-${selectedGame?.teams?.away?.probablePitcher?.lastName}-${selectedGame?.teams?.away?.probablePitcher?.id}?stats=statcast-r-pitching-mlb`}
            target='_blank'
          >
            Statcast
          </a>
        </div>
        <PitcherStats
          playerId={selectedGame?.teams?.away?.probablePitcher?.id}
        />
      </div>
      <div>
        <div className='flex flex-row items-center mb-2'>
          <img
            src={`https://midfield.mlbstatic.com/v1/people/${selectedGame?.teams?.home?.probablePitcher?.id}/spots/80`}
            className='w-10 mr-2'
          />
          <div className='mr-1'>
            {selectedGame?.teams?.home?.probablePitcher?.lastName}
          </div>
          <a
            href={`https://baseballsavant.mlb.com/savant-player/${selectedGame?.teams?.home?.probablePitcher?.firstName}-${selectedGame?.teams?.home?.probablePitcher?.lastName}-${selectedGame?.teams?.home?.probablePitcher?.id}?stats=statcast-r-pitching-mlb`}
            target='_blank'
          >
            Statcast
          </a>
        </div>
        <PitcherStats
          playerId={selectedGame?.teams?.home?.probablePitcher?.id}
        />
      </div>
    </div>
  )
}

export default App
