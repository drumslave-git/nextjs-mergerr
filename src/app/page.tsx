import Apps from "@/components/Apps"
import Box from "@mui/material/Box"
import Link from "next/link"
import Paper from "@mui/material/Paper"
import Button from "@mui/material/Button"

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

export default async function Home() {
  return (
    <>
      <Paper className="flex min-h-screen flex-col items-center justify-between p-24">
        <Apps />
      </Paper>
      <Box sx={{display: "flex", justifyContent: "center", marginY: 2}}>
        <Link href="/apps/new">
          <Button color="primary" variant="contained">
            Add App
          </Button>
        </Link>
      </Box>
    </>
  )
}
