import Box from "@mui/material/Box"
import CircularProgress, {CircularProgressProps} from "@mui/material/CircularProgress"

type InfinitProgressOverlay = CircularProgressProps & {zIndex?: number, background?: string}

const InfinitProgressOverlay = (props: InfinitProgressOverlay) => {
  const {
    zIndex = 1,
    background = 'rgba(0, 0, 0, .8)',
    ...rest
  } = props

  return (
    <Box sx={{
      display: 'flex', position: 'absolute',
      inset: 0,
      alignItems: 'center',
      justifyContent: 'center',
      background,
      zIndex
    }}>
      <CircularProgress {...rest} />
    </Box>
  )
}

export default InfinitProgressOverlay