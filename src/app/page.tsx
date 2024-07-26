import AppIcon from "@/components/AppIcon"
import {prisma} from "@/lib/prisma"
import Box from "@mui/material/Box"
import Link from "next/link"
import Paper from "@mui/material/Paper"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import ListItemIcon from "@mui/material/ListItemIcon"
import Button from "@mui/material/Button"

export default async function Home() {
  const apps = await prisma.app.findMany()

  return (
    <>
      <Paper className="flex min-h-screen flex-col items-center justify-between p-24">
        <List>
          {apps.map((app) => (
            <ListItem key={app.id}>
              <ListItemIcon>
                <AppIcon app={app}/>
              </ListItemIcon>
              <ListItemText primary={app.name}/>
              <Link href={`/apps/${app.id}`} passHref>
                <Button color="primary">
                  View
                </Button>
              </Link>
              <Link href={`/apps/${app.id}/edit`} passHref>
                <Button color="secondary">
                  Edit
                </Button>
              </Link>
              <Link href={`/apps/${app.id}/delete`} passHref>
                <Button color="error">
                  Delete
                </Button>
              </Link>
            </ListItem>
          ))}
        </List>
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
