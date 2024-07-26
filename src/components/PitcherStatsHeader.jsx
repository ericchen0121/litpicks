function PitcherStatsHeader({ pitcherInfo = {} }) {
  return (
    <div className='flex flex-row items-center mb-2'>
      <img
        src={`https://midfield.mlbstatic.com/v1/people/${pitcherInfo.id}/spots/80`}
        className='w-10 mr-2'
      />
      <div className='flex flex-row'>
        <div>
          <div className='mr-1'>
            {pitcherInfo.lastName}, {pitcherInfo.firstName}
          </div>
          <div className='text-xs'>{pitcherInfo.pitchHand?.code}HP</div>
        </div>
        <div>
          <a
            href={`https://baseballsavant.mlb.com/savant-player/${pitcherInfo.firstName}-${pitcherInfo.lastName}-${pitcherInfo.id}?stats=statcast-r-pitching-mlb`}
            target='_blank'
            className='text-sm'
          >
            <img
              src='https://baseballsavant.mlb.com/site-core/images/savant-logo.svg'
              style={{ width: 20 }}
            />
          </a>
        </div>
      </div>
    </div>
  )
}

export default PitcherStatsHeader
