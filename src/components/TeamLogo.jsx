const TeamLogo = ({ teamId, size = 24, className, variant = 1 }) => {
  if (!teamId) return

  let src
  switch (variant) {
    case 1: // no bg
      src = `https://www.mlbstatic.com/team-logos/${teamId}.svg`
      break
    default: // colored, circular bg
      src = `https://midfield.mlbstatic.com/v1/team/${teamId}/spots/48`
  }
  return (
    <img
      src={src}
      className={className}
      style={{ width: size, height: size }}
    />
  )
}

export default TeamLogo
