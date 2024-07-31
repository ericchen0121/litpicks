import { useState } from 'react'
import { format, subDays } from 'date-fns'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TeamLogo } from '@/components'

function TeamHittingLastX({ teamId, x = 10 }) {
  const [lastX, setLastX] = useState([])
  const fetchData = async () => {
    try {
      const endDate = format(new Date(), 'yyyy-MM-dd')
      const startDate = format(subDays(new Date(), x + 10), 'yyyy-MM-dd') // get 10 extra days worth of games
      let res = await fetch(
        `https://statsapi.mlb.com/api/v1/schedule?sportId=1&sportId=51&sportId=21&startDate=${startDate}&endDate=${endDate}&timeZone=America/New_York&teamId=${teamId}&gameType=E&&gameType=S&&gameType=R&&gameType=F&&gameType=D&&gameType=L&&gameType=W&&gameType=A&language=en&leagueId=104&&leagueId=103&&leagueId=160&&leagueId=590&sortBy=gameDate,gameType&hydrate=team,linescore(matchup,runners),xrefId,flags,statusFlags,broadcasts(all),venue(location),decisions,person,probablePitcher,stats,game(content(media(epg),summary),tickets),seriesStatus(useOverride=true)`
      )
      let data = await res.json()
      setLastX(
        data.dates
          .reverse()
          .flatMap((item) => item.games)
          .filter((g) => g.status.statusCode !== 'S') // ie. Scheduled (we want finished games)
          .slice(0, x)
      )
    } catch (err) {
      console.error('Error fetching data:', err) // Log the error
    }
  }
  console.log(lastX)
  const handleOpen = async (open) => {
    if (open) await fetchData()
  }

  const countI01RunsScored = lastX
    .map((game) => {
      const firstInning = game.linescore?.innings?.[0]
      const isAwayTeam = game.teams.away.team.id === teamId
      const runsScoredInFirstInning = isAwayTeam
        ? firstInning?.away?.runs
        : firstInning?.home?.runs
      return runsScoredInFirstInning > 0
    })
    .reduce((acc, curr) => Number(curr) + acc, 0)

  const countI01RunsGiven = lastX
    .map((game) => {
      const firstInning = game.linescore?.innings?.[0]
      const isAwayTeam = game.teams.away.team.id === teamId
      const runsGivenInFirstInning = isAwayTeam
        ? firstInning?.home?.runs
        : firstInning?.away?.runs
      return runsGivenInFirstInning > 0
    })
    .reduce((acc, curr) => Number(curr) + acc, 0)

  const countI01RunsTotal = lastX
    .map((game) => {
      const firstInning = game.linescore?.innings?.[0]
      const runsGivenInFirstInning =
        firstInning?.home?.runs + firstInning?.away?.runs
      return runsGivenInFirstInning > 0
    })
    .reduce((acc, curr) => Number(curr) + acc, 0)

  const count = lastX.length
  return (
    <Popover onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' size='xs'>
          Last {x}
        </Button>
      </PopoverTrigger>
      <PopoverContent side='right' style={{ width: 400 }}>
        <Table>
          <TableCaption>
            {
              <div className='items-start justify-center'>
                <div className='flex flex-row'>
                  <span className='mr-2'>
                    <TeamLogo teamId={teamId} />
                  </span>
                  Scored 1st Inn. Run {countI01RunsScored}/{count} Games
                  <span className='font-bold'>
                    ({((countI01RunsScored / count) * 100).toFixed(0)}%)
                  </span>
                </div>
                <div className='flex flex-row'>
                  <span className='mr-2'>
                    <TeamLogo teamId={teamId} />
                  </span>
                  Allowed 1st Inn. Run {countI01RunsGiven}/{count} Games
                  <span className='font-bold'>
                    ({((countI01RunsGiven / count) * 100).toFixed(0)}%)
                  </span>
                </div>
                <div className='flex flex-row'>
                  <span className='mr-2'>
                    <TeamLogo teamId={teamId} />
                  </span>
                  Scored OR Allowed 1st Inn. Run {countI01RunsTotal}/{count}{' '}
                  Games
                  <span className='font-bold'>
                    ({((countI01RunsTotal / count) * 100).toFixed(0)}%)
                  </span>
                </div>
              </div>
            }
          </TableCaption>
          {x >= 11 ? (
            <></>
          ) : (
            <>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[100px]' style={{ padding: 2 }}>
                    Date
                  </TableHead>
                  <TableHead style={{ padding: 2 }}>vs.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lastX.map((game) => (
                  <TableRow key={game.gamePk}>
                    <TableCell className='font-medium' style={{ padding: 2 }}>
                      {format(game.gameDate, 'MM-dd')}
                    </TableCell>
                    <TableCell style={{ padding: 2 }}>
                      <div className='flex flex-row'>
                        <TeamLogo teamId={game.teams.away.team.id} />
                        <span className='ml-2 mr-2 text-gray-500'>@</span>
                        <TeamLogo teamId={game.teams.home.team.id} />
                      </div>
                    </TableCell>
                    <TableCell style={{ padding: 2 }}>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead style={{ padding: 2 }}></TableHead>
                            <TableHead style={{ padding: 2 }}>1</TableHead>
                            <TableHead style={{ padding: 2 }}>R</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell style={{ padding: 2 }}>
                              {game.teams.away.team.clubName}
                            </TableCell>
                            <TableCell style={{ padding: 2 }}>
                              {game.linescore?.innings?.[0]?.away?.runs}
                            </TableCell>
                            <TableCell style={{ padding: 2 }}>
                              {game.teams.away.score}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell style={{ padding: 2 }}>
                              {game.teams.home.team.clubName}
                            </TableCell>
                            <TableCell style={{ padding: 2 }}>
                              {game.linescore?.innings?.[0]?.home?.runs}
                            </TableCell>
                            <TableCell style={{ padding: 2 }}>
                              {game.teams.home.score}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </>
          )}
        </Table>
      </PopoverContent>
    </Popover>
  )
}

export default TeamHittingLastX
