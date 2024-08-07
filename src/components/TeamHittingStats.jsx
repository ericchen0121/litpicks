import { useState, useEffect } from 'react'
import { format, subMonths } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { ordinalSuffixOf } from '@/lib/utils'
import { TeamHittingLastX, TeamLogo } from '@/components'

function TeamHittingStats({ teamId, vsHand = 'R' }) {
  const [seasonData, setSeasonData] = useState([]) // season data
  const [monthData, setMonthData] = useState([]) // current month data
  const [i01Data, seti01Data] = useState([]) // 1st inning data
  const [vsHandData, setVsHandData] = useState([]) // vs RHP or LHP
  const [ig01Data, setig01Data] = useState([]) // 1-6th inning
  const statsApi = `https://bdfed.stitch.mlbinfra.com/bdfed/stats/team?&env=prod&sportId=1&gameType=R&group=hitting&order=desc&sortStat=runsBattedIn&stats=season&season=2024&limit=30&offset=0`
  const [subMonthCount, setSubMonthCount] = useState(0)

  // refetch data if month data (ie. on Aug 1, Aug data won't be available, so decrement month and get July data)
  useEffect(() => {
    const fetchMonthData = async () => {
      const month = format(subMonths(new Date(), subMonthCount), 'M')
      let monthRes = await fetch(`${statsApi}&sitCodes=${month}`)
      let monthData = await monthRes.json()
      setMonthData(monthData.stats)
      if (monthData.stats.length === 0) setSubMonthCount(subMonthCount + 1)
    }
    if (subMonthCount !== 0) fetchMonthData()
  }, [subMonthCount])

  useEffect(() => {
    setSubMonthCount(0)
    const fetchData = async () => {
      try {
        let res = await fetch(statsApi)
        let data = await res.json()
        setSeasonData(data.stats)

        const month = format(subMonths(new Date(), subMonthCount), 'M')
        let monthRes = await fetch(`${statsApi}&sitCodes=${month}`)
        let monthData = await monthRes.json()
        setMonthData(monthData.stats)
        if (monthData.stats.length === 0) setSubMonthCount(subMonthCount + 1)

        let i01Res = await fetch(`${statsApi}&sitCodes=i01`)
        let i01Data = await i01Res.json()
        seti01Data(i01Data.stats)
        let vsHandRes = await fetch(
          `${statsApi}&sitCodes=v${vsHand.toLowerCase()}`
        )
        let vsHandData = await vsHandRes.json()
        setVsHandData(vsHandData.stats)
        let ig01Res = await fetch(`${statsApi}&sitCodes=ig01`)
        let ig01Data = await ig01Res.json()
        setig01Data(ig01Data.stats)
      } catch (err) {
        console.error('Error fetching data:', err) // Log the error
      }
    }
    fetchData()
  }, [])

  const displayStats = {
    rbi: 'RBI',
    homeRuns: 'HR',
    avg: 'AVG',
    hits: 'H',
    runs: 'R',
    baseOnBalls: 'BB',
    leftOnBase: 'LOB',
    numberOfPitches: 'NP',
    strikeOuts: 'SO',
  }
  console.log('subMonthCount', subMonthCount)
  return (
    <div>
      <div className='flex flex-row mb-2'>
        <TeamLogo teamId={teamId} className='mr-2' />
        <span className='mr-2'>
          <TeamHittingLastX teamId={teamId} x={5} />
        </span>
        <span className='mr-2'>
          <TeamHittingLastX teamId={teamId} />
        </span>
        <span className='mr-2'>
          <TeamHittingLastX teamId={teamId} x={20} />
        </span>
        <span className='mr-2'>
          <TeamHittingLastX teamId={teamId} x={30} />
        </span>
      </div>
      <div className='flex flex-row mb-2'>
        <span className='font-light text-xs w-12'>Season</span>
        {Object.entries(displayStats).map(([k, v]) => {
          return (
            <Badge variant='secondary' className='mr-2' key={`season-${k}`}>
              {ordinalSuffixOf(
                seasonData
                  .sort((a, b) => b[k] - a[k])
                  ?.findIndex((x) => x.teamId === teamId) + 1
              )}{' '}
              {v}
            </Badge>
          )
        })}
      </div>
      <div className='flex flex-row mb-2'>
        <span className='font-light text-xs w-12'>
          {format(subMonths(new Date(), subMonthCount), 'MMMM')}
        </span>
        {Object.entries(displayStats).map(([k, v]) => {
          return (
            <Badge variant='secondary' className='mr-2' key={`month-${k}`}>
              {ordinalSuffixOf(
                monthData
                  .sort((a, b) => b[k] - a[k])
                  ?.findIndex((x) => x.teamId === teamId) + 1
              )}{' '}
              {v}
            </Badge>
          )
        })}
      </div>
      <div className='flex flex-row mb-2'>
        <span className='font-light text-xs w-12'>1st Inn</span>
        {Object.entries(displayStats).map(([k, v]) => {
          return (
            <Badge variant='secondary' className='mr-2' key={`1stI-${k}`}>
              {ordinalSuffixOf(
                i01Data
                  .sort((a, b) => b[k] - a[k])
                  ?.findIndex((x) => x.teamId === teamId) + 1
              )}{' '}
              {v}
            </Badge>
          )
        })}
      </div>
      <div className='flex flex-row mb-2'>
        <span className='font-light text-xs w-12'>1-6 Inn</span>
        {Object.entries(displayStats).map(([k, v]) => {
          return (
            <Badge variant='secondary' className='mr-2' key={`1-6I-${k}`}>
              {ordinalSuffixOf(
                ig01Data
                  .sort((a, b) => b[k] - a[k])
                  ?.findIndex((x) => x.teamId === teamId) + 1
              )}{' '}
              {v}
            </Badge>
          )
        })}
      </div>
      <div className='flex flex-row mb-2'>
        <span className='font-light text-xs w-12'>vs. {vsHand}</span>
        {Object.entries(displayStats).map(([k, v]) => {
          return (
            <Badge variant='secondary' className='mr-2' key={`vsHand-${k}`}>
              {ordinalSuffixOf(
                vsHandData
                  .sort((a, b) => b[k] - a[k])
                  ?.findIndex((x) => x.teamId === teamId) + 1
              )}{' '}
              {v}
            </Badge>
          )
        })}
      </div>
    </div>
  )
}

export default TeamHittingStats
