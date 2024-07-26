'use client'

import CssBaseline from "@mui/material/CssBaseline"
import {useMemo} from "react"
import useMediaQuery from '@mui/material/useMediaQuery'
import {ThemeProvider, createTheme} from '@mui/material/styles'

export default function ClientTheme(props: any) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  )

  return (

    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme /> {props.children}
    </ThemeProvider>
  )
}