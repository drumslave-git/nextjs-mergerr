
import CircularProgressWithLabel from "@/components/common/CircularProgressWithLabel"
import {useMemo} from "react"

export default function Rating({value, size}: { value?: number, size?: number }) {

  const voteAverage = useMemo(() => {
    return (value || 0) * 10
  }, [value])

  const voteColor = useMemo(() => {
    if(voteAverage === 0) {
      return 'grey'
    }
    if(voteAverage < 4) {
      return 'error'
    }
    if(voteAverage < 7) {
      return 'warning'
    }

    return 'success'
  }, [voteAverage])

  return (
      <CircularProgressWithLabel value={voteAverage === 0 ? 100 : voteAverage} color={voteColor} label={voteAverage} thickness={3} size={size} />
  )
}