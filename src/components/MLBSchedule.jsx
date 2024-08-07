import { useState, useEffect } from 'react'
import { format, addDays, isSameDay, isToday } from 'date-fns'
import { cn } from '@/lib/utils'
import { TeamLogo } from '@/components'

function MLBSchedule({ setSelectedGame = () => {}, selectedGame = {} }) {
  const [selectedDay, setSelectedDay] = useState()
  const [games, setGames] = useState([])
  const [filters, setFilters] = useState([]) // 'F': Final, 'I': In-Progress, 'O': 'Game Over', 'S': Scheduled, 'P': Pre-game

  useEffect(() => {
    const fetchData = async () => {
      try {
        const date = format(selectedDay, 'yyyy-MM-dd')

        let res = await fetch(
          `https://statsapi.mlb.com/api/v1/schedule?sportId=1&sportId=51&sportId=21&startDate=${date}&endDate=${date}&timeZone=America/New_York&gameType=E&&gameType=S&&gameType=R&&gameType=F&&gameType=D&&gameType=L&&gameType=W&&gameType=A&language=en&leagueId=104&&leagueId=103&&leagueId=160&&leagueId=590&sortBy=gameDate,gameType&hydrate=team,linescore(matchup,runners),xrefId,flags,statusFlags,broadcasts(all),venue(location),decisions,person,probablePitcher,stats,game(content(media(epg),summary),tickets),seriesStatus(useOverride=true)`
        )
        let data = await res.json()
        let filteredGames = data.dates[0].games.filter(
          (g) => !filters.includes(g.status.statusCode)
        )
        setGames(filteredGames)
        setSelectedGame(filteredGames?.[0])
      } catch {}
    }

    fetchData()
  }, [selectedDay])

  useEffect(() => {
    setSelectedDay(new Date())
  }, [])

  const handleDayClick = (day) => {
    setSelectedDay(day)
  }

  return (
    <div>
      <div className='flex mb-3'>
        {[-3, -2, -1, 0, 1, 2, 3].map((d) => {
          const day = addDays(new Date(), d)
          const isSame = isSameDay(day, selectedDay)
          return (
            <div
              key={`day-${day}`}
              className={cn(
                'text-center mr-4 cursor-pointer',
                isSame ? 'font-bold' : 'text-gray-500'
              )}
              onClick={() => handleDayClick(day)}
            >
              <div className='text-sm'>
                {isToday(day) ? 'TODAY' : format(day, 'EEE').toUpperCase()}
              </div>
              <div>{format(day, 'MMM d').toUpperCase()} </div>
            </div>
          )
        })}
      </div>
      <div className='flex flex-row'>
        {games.map((game) => {
          let header
          switch (game.status.statusCode) {
            case 'O':
            case 'F':
              header = 'Final'
              break
            case 'I':
              header = `${game.linescore.inningState} ${game.linescore.currentInning}`
              break
            case 'P':
            case 'S':
              header = format(game.gameDate, 'h:mma')
              break
            default:
              header = game.status.detailedState.split(' ')[0]
              break
          }

          let lineAway, lineHome
          switch (game.status.statusCode) {
            case 'P':
            case 'S':
            case 'PW':
            case 'DR': // Postponed
              lineAway = game.teams.away.team.abbreviation
              lineHome = game.teams.home.team.abbreviation
              break
            default:
              lineAway = game?.linescore?.teams.away.runs
              lineHome = game?.linescore?.teams.home.runs
              break
          }

          const isSelected = selectedGame?.gamePk === game.gamePk
          console.log('selected', selectedGame)
          return (
            <div key={`schedule-${game.gamePk}`} className='w-max'>
              <div
                className='p-2 mr-1 ml-1 rounded cursor-default'
                style={{
                  border: isSelected ? '1px solid green' : '1px solid gray',
                  backgroundColor: isSelected ? 'lightgray' : 'white',
                }}
                onClick={() => setSelectedGame(game)}
              >
                <div className='text-sm font-mono mb-1'>{header}</div>
                <div className='flex flex-row font-semibold text-lg mb-1 items-center justify-center'>
                  <TeamLogo
                    teamId={game.teams.away.team.id}
                    className='mr-1'
                    size={20}
                  />
                  {lineAway}
                </div>
                <div className='flex flex-row font-semibold text-lg items-center justify-center'>
                  <TeamLogo
                    teamId={game.teams.home.team.id}
                    className='mr-1'
                    size={20}
                  />
                  {lineHome}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MLBSchedule
