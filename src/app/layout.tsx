import type { Metadata } from "next"
import Link from "next/link"
import {ReactNode} from "react"
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'
import Button from "@mui/material/Button"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"

import ClientTheme from "@/components/ClientTheme"

export const metadata: Metadata = {
  title: "Mergerr",
  description: "Merge split files for arrs stack",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {

  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ClientTheme>
              <Paper elevation={2} component="header" sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 1,
                mb: 2,
              }}>
                <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                  Mergerr
                </Typography>
                <Link href="/" passHref>
                  <Button>Home</Button>
                </Link>
              </Paper>
            {children}
          </ClientTheme>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
