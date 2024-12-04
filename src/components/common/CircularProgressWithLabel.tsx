import CircularProgress, {
  CircularProgressProps,
} from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import {ReactNode} from "react"

export default function CircularProgressWithLabel(
  props: Omit<CircularProgressProps, 'color' | 'value'> & { value: number, color: any, label: ReactNode },
) {
  const {color, value, label, ...rest} = props
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...rest} value={value} color={color} />
      <Box
        sx={{
          inset: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          component="div"
          sx={{ color: 'text.secondary', lineHeight: 1 }}
        >{props.label !== undefined ? props.label : `${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  )
}