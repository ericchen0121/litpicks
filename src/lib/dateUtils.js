import { differenceInYears, parse } from 'date-fns'

export const calculateAge = (dob) => {
  if (!dob) return ''
  const date = parse(dob, 'yyyy-MM-dd', new Date())
  if (!date) return ''
  const age = differenceInYears(new Date(), date)
  return age
}
