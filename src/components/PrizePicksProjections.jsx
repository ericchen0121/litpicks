import { useState, useEffect } from 'react'
import { format } from 'date-fns'

function PrizePicksProjections({}) {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async (id) => {
      try {
        let res = await fetch(
          `https://api.prizepicks.com/projections?league_id=2&per_page=250&single_stat=true&state_code=CA&game_mode=pickem`
        )
        let data = await res.json()

        setData(data)
      } catch {}
    }
    fetchData()
  }, [])

  console.log('PP Projections', data)

  return <div></div>
}

export default PrizePicksProjections
