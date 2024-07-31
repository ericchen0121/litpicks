import { calculateAge } from '@/lib/dateUtils'
import { TeamLogo } from '@/components'
import { GalleryHorizontalEnd } from 'lucide-react'

function PitcherStatsHeader({ pitcherInfo = {}, teamId }) {
  return (
    <div className='flex flex-row items-center mb-2'>
      <img
        src={`https://midfield.mlbstatic.com/v1/people/${pitcherInfo.id}/spots/80`}
        className='w-10 mr-2'
      />
      <TeamLogo teamId={teamId} className='mr-2' />
      <div className='flex flex-row'>
        <div className='mr-2'>
          <div className='mr-1'>
            <a
              href={`https://www.mlb.com/player/${pitcherInfo.nameSlug}?stats=gamelogs-r-pitching-mlb&year=2024`}
              target='_blank'
              className='text-sm'
            >
              {pitcherInfo.lastName}, {pitcherInfo.useName}
            </a>
          </div>
          <div className='text-xs'>
            <span className='mr-1'>{pitcherInfo.pitchHand?.code}HP</span>
            <span>
              {pitcherInfo.height} {pitcherInfo.weight} {'Age: '}
              {calculateAge(pitcherInfo.birthDate)}
            </span>
          </div>
        </div>
        <div>
          <a
            href={`https://www.mlb.com/stories/player/${pitcherInfo.id}`}
            target='_blank'
          >
            <GalleryHorizontalEnd color='gray' size={20} />
          </a>
          <a
            href={`https://baseballsavant.mlb.com/savant-player/${pitcherInfo.nameSlug}?stats=statcast-r-pitching-mlb`}
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
