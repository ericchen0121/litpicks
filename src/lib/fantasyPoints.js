export const prizePicksFP = {
  mlb: {
    hitting: {},
    pitching: {
      win: 6,
      qualityStart: 4,
      earnedRun: -3,
      strikeOut: 3,
      out: 1,
    },
  },
}

export const underdogFP = {
  mlb: {
    hitting: {},
    pitching: {
      win: 5,
      qualityStart: 5,
      earnedRun: -3,
      strikeOut: 3,
      out: 1,
    },
  },
}

export const getMLBPitchingFP = (split = {}, provider = 'underdog') => {
  const sport = 'mlb',
    stat = 'pitching'
  let fpProvider = provider === 'underdog' ? underdogFP : prizePicksFP
  let fp = 0
  fp += split.stat.wins * fpProvider[sport][stat].win
  fp +=
    Number(split.stat.inningsPitched) >= 6 && split.stat.earnedRuns <= 3
      ? fpProvider[sport][stat].qualityStart
      : 0
  fp += split.stat.outs * fpProvider[sport][stat].out
  fp += split.stat.earnedRuns * fpProvider[sport][stat].earnedRun
  fp += split.stat.strikeOuts * fpProvider[sport][stat].strikeOut
  return fp
}
