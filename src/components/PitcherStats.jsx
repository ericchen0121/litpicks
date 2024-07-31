import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { getMLBPitchingFP } from '@/lib/fantasyPoints'
import { TeamLogo } from '@/components'
import underdogLogo from '@/assets/underdog.webp'
import prizePicksLogo from '@/assets/prizepicks.avif'

function PitcherStats({ playerId }) {
  const [data, setData] = useState([])
  const [pitcherId, setPitcherId] = useState()

  useEffect(() => {
    const fetchData = async (id) => {
      try {
        let res = await fetch(
          `https://statsapi.mlb.com/api/v1/people/${id}/stats?stats=gameLog&leagueListId=mlb_hist&group=pitching&gameType=R&sitCodes=1,2,3,4,5,6,7,8,9,10,11,12&hydrate=team&season=2024&language=en`
        )
        let data = await res.json()
        data =
          data.stats.length > 0
            ? data.stats[0].splits.filter((s) => s.stat.gamesStarted)
            : []
        setData(data)
      } catch {}
    }

    setData([])
    if (playerId) {
      setPitcherId(playerId)
      fetchData(playerId)
    }
  }, [playerId])

  useEffect(() => {
    const fetchData = async () => {
      const newDataPromises = data.map(async (item) => {
        // Make an API call for each item
        try {
          let response = await fetch(
            `https://statsapi.mlb.com/api/v1.1/game/${item.game.gamePk}/feed/live/`
          )
          if (!response.ok) {
            throw new Error(`Network response was not ok for item ${item.id}`)
          }
          const data = await response.json()
          let isHome = data.gameData.probablePitchers?.home?.id === pitcherId
          let firstInningPlays = data.liveData.plays.allPlays.filter((p) => {
            return p.about.inning === 1 && p.matchup.pitcher.id === pitcherId
          })
          let firstInningKs = firstInningPlays.filter(
            (p) => p.result.eventType === 'strikeout'
          ).length

          let firstInningData =
            data.liveData.linescore.innings[0][isHome ? 'away' : 'home']
          return {
            ...item,
            firstInningKs,
            firstInningData,
          }
        } catch (error) {
          console.error(`Error fetching data for item ${item.id}:`, error)
          return item // Return the original item in case of error
        }
      })

      // Wait for all promises to resolve
      const newData = await Promise.all(newDataPromises)
      setData(newData)
    }
    if (data.length && !('firstInningKs' in data?.[0])) {
      fetchData()
    }
  }, [data])

  if (!playerId) return <></>

  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td>Date</td>
            {data.map((split) => {
              return (
                <td key={split.game.gamePk}>
                  {format(split.date.replaceAll('-', '/'), 'M/d')}
                </td>
              )
            })}
            <td className='p-1'>Avg</td>
            <td className='p-1'>L3</td>
            <td className='p-1'>L5</td>
            <td className='p-1'>L10</td>
          </tr>
          <tr>
            <td>vs</td>
            {data.map((split) => {
              return (
                <td className='p-1' key={split.game.gamePk}>
                  <TeamLogo teamId={split.opponent.id} />
                </td>
              )
            })}
          </tr>
          <tr>
            <td>IP</td>
            {data.map((split) => {
              return (
                <td className='p-1' key={split.game.gamePk}>
                  {split.stat.inningsPitched}
                </td>
              )
            })}
          </tr>
          <tr>
            <td>Outs</td>
            {data.map((split) => {
              return (
                <td className='p-1' key={split.game.gamePk}>
                  {split.stat.outs}
                </td>
              )
            })}
            <td>
              {(
                data
                  .map((s) => s.stat.outs)
                  .reduce((acc, curr) => curr + acc, 0) / data.length
              ).toFixed(1)}
            </td>
            <td>
              {(
                data
                  .slice(data.length - 3)
                  .map((s) => s.stat.outs)
                  .reduce((acc, curr) => curr + acc, 0) / 3
              ).toFixed(1)}
            </td>
            <td>
              {(
                data
                  .slice(data.length - 5)
                  .map((s) => s.stat.outs)
                  .reduce((acc, curr) => curr + acc, 0) / 5
              ).toFixed(1)}
            </td>
            <td>
              {(
                data
                  .slice(data.length - 10)
                  .map((s) => s.stat.outs)
                  .reduce((acc, curr) => curr + acc, 0) / 10
              ).toFixed(1)}
            </td>
          </tr>
          <tr>
            <td>ERA</td>
            {data.map((split) => {
              return (
                <td className='p-1' key={split.game.gamePk}>
                  {split.stat.era}
                </td>
              )
            })}
          </tr>
          <tr>
            <td>K</td>
            {data.map((split) => {
              return (
                <td className='p-1' key={split.game.gamePk}>
                  {split.stat.strikeOuts}
                </td>
              )
            })}
            <td>
              {(
                data
                  .map((s) => s.stat.strikeOuts)
                  .reduce((acc, curr) => curr + acc, 0) / data.length
              ).toFixed(1)}
            </td>
            <td>
              {(
                data
                  .slice(data.length - 3)
                  .map((s) => s.stat.strikeOuts)
                  .reduce((acc, curr) => curr + acc, 0) / 3
              ).toFixed(1)}
            </td>
            <td>
              {(
                data
                  .slice(data.length - 5)
                  .map((s) => s.stat.strikeOuts)
                  .reduce((acc, curr) => curr + acc, 0) / 5
              ).toFixed(1)}
            </td>
            <td>
              {(
                data
                  .slice(data.length - 10)
                  .map((s) => s.stat.strikeOuts)
                  .reduce((acc, curr) => curr + acc, 0) / 10
              ).toFixed(1)}
            </td>
          </tr>
          <tr>
            <td>1stI K</td>
            {data.map((split) => {
              return (
                <td className='p-1' key={split.game.gamePk}>
                  {split.firstInningKs}
                </td>
              )
            })}
          </tr>
          <tr>
            <td>ER</td>
            {data.map((split) => {
              return (
                <td className='p-1' key={split.game.gamePk}>
                  {split.stat.earnedRuns}
                </td>
              )
            })}
            <td>
              {(
                data
                  .map((s) => s.stat.earnedRuns)
                  .reduce((acc, curr) => curr + acc, 0) / data.length
              ).toFixed(1)}
            </td>
            <td>
              {(
                data
                  .slice(data.length - 3)
                  .map((s) => s.stat.earnedRuns)
                  .reduce((acc, curr) => curr + acc, 0) / 3
              ).toFixed(1)}
            </td>
            <td>
              {(
                data
                  .slice(data.length - 5)
                  .map((s) => s.stat.earnedRuns)
                  .reduce((acc, curr) => curr + acc, 0) / 5
              ).toFixed(1)}
            </td>
            <td>
              {(
                data
                  .slice(data.length - 10)
                  .map((s) => s.stat.earnedRuns)
                  .reduce((acc, curr) => curr + acc, 0) / 10
              ).toFixed(1)}
            </td>
          </tr>
          <tr>
            <td>1stI R</td>
            {data.map((split) => {
              return (
                <td className='p-1' key={split.game.gamePk}>
                  {split.firstInningData?.runs}
                </td>
              )
            })}
          </tr>
          <tr>
            <td>H</td>
            {data.map((split) => {
              return (
                <td className='p-1' key={split.game.gamePk}>
                  {split.stat.hits}
                </td>
              )
            })}
            <td>
              {(
                data
                  .map((s) => s.stat.hits)
                  .reduce((acc, curr) => curr + acc, 0) / data.length
              ).toFixed(1)}
            </td>
            <td>
              {(
                data
                  .slice(data.length - 3)
                  .map((s) => s.stat.hits)
                  .reduce((acc, curr) => curr + acc, 0) / 3
              ).toFixed(1)}
            </td>
            <td>
              {(
                data
                  .slice(data.length - 5)
                  .map((s) => s.stat.hits)
                  .reduce((acc, curr) => curr + acc, 0) / 5
              ).toFixed(1)}
            </td>
            <td>
              {(
                data
                  .slice(data.length - 10)
                  .map((s) => s.stat.hits)
                  .reduce((acc, curr) => curr + acc, 0) / 10
              ).toFixed(1)}
            </td>
          </tr>
          <tr>
            <td>1stI H</td>
            {data.map((split) => {
              return (
                <td className='p-1' key={split.game.gamePk}>
                  {split.firstInningData?.hits}
                </td>
              )
            })}
          </tr>
          <tr>
            <td>P/IP</td>
            {data.map((split) => {
              return (
                <td className='p-1' key={split.game.gamePk}>
                  {Number(split.stat.pitchesPerInning).toFixed(1)}
                </td>
              )
            })}
          </tr>
          <tr>
            <td>
              <img src={prizePicksLogo} style={{ width: 24 }} />
            </td>
            {data.map((split) => {
              return (
                <td className='p-1' key={split.game.gamePk}>
                  {getMLBPitchingFP(split, 'prizePicks')}
                </td>
              )
            })}
          </tr>
          <tr>
            <td>
              <img src={underdogLogo} style={{ width: 24 }} />
            </td>
            {data.map((split) => {
              return (
                <td className='p-1' key={split.game.gamePk}>
                  {getMLBPitchingFP(split, 'underdog')}
                </td>
              )
            })}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default PitcherStats
