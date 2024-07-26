import { useState, useEffect } from 'react'
import { format } from 'date-fns'

function MLBSchedule({ setSelectedGame = () => {}, selectedGame = {} }) {
  const [games, setGames] = useState([])
  const [filters, setFilters] = useState([]) // 'F': Final, 'I': In-Progress, 'O': 'Game Over', 'S': Scheduled, 'P': Pre-game
  useEffect(() => {
    const fetchData = async () => {
      try {
        const date = format(new Date(), 'yyyy-MM-dd')
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
  }, [])

  console.log('schedule games', games)

  return (
    <div>
      <div className='flex flex-row'>
        {games.map((game) => {
          const isSelected = selectedGame?.gamePk === game.gamePk
          return (
            <>
              <div
                className='p-2 mr-1 ml-1 rounded cursor-default'
                style={{
                  border: isSelected ? '1px solid green' : '1px solid gray',
                  backgroundColor: isSelected ? 'lightgray' : 'white',
                }}
                onClick={() => setSelectedGame(game)}
              >
                <div className='text-xs font-mono mb-1'>
                  {format(game.gameDate, 'h:mma')}
                </div>
                <div className='flex flex-row font-semibold text-sm mb-1'>
                  <img
                    src={`https://midfield.mlbstatic.com/v1/team/${game.teams.away.team.id}/spots/48`}
                    style={{ width: 24, height: 24 }}
                    className='mr-1'
                  />
                  {game.teams.away.team.abbreviation}
                </div>
                <div className='flex flex-row font-semibold text-sm'>
                  <img
                    src={`https://midfield.mlbstatic.com/v1/team/${game.teams.home.team.id}/spots/48`}
                    style={{ width: 24, height: 24 }}
                    className='mr-1'
                  />
                  {game.teams.home.team.abbreviation}
                </div>
              </div>
            </>
          )
        })}
      </div>
    </div>
  )
}

export default MLBSchedule
