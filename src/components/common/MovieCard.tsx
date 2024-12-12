'use client'

import {Movie} from "@/common/api/Radarr/entities/MovieAPI"
import {MovieResult} from "@/common/api/TMDB/entities/SearchAPI"
import {BackdropImage, PosterImage} from "@/components/common/MovieImage"
import {useTMDBApi} from "@/components/TMDBApiProvider"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Chip from "@mui/material/Chip"
import Grid2 from "@mui/material/Grid2"
import Stack from "@mui/material/Stack"
import {alpha} from "@mui/material/styles"
import styled from "@mui/material/styles/styled"
import Typography from "@mui/material/Typography"
import Link from "next/link"
import {ReactNode} from "react"

const SemiTransparentCard = styled(Card)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.55),
}))


export default function MovieCard({movie, children, actions}: { movie: Movie | MovieResult, children?: ReactNode, actions?: ReactNode }) {
  return (
    <>
      <BackdropImage movie={movie} size={-1} sx={{position: 'absolute', maxHeight: '50%', zIndex: 1, opacity: .5}} />
      <Grid2 container spacing={2} padding={2} zIndex={2} position="relative">
        <Grid2 size={{xs: 12, sm: 5, md: 4}}>
          <PosterImage movie={movie} size={0} />
        </Grid2>
        <Grid2 size={{xs: 12, sm: 7, md: 8}}>
          <Stack direction="column" spacing={2}>
            <SemiTransparentCard raised>
              <CardContent>
                <Link href={`https://www.themoviedb.org/movie/${(movie as Movie).tmdbId || movie.id}`} target="_blank">
                  <Chip label="TMDB" />
                </Link>
              </CardContent>
            </SemiTransparentCard>
            {movie.overview && (
              <SemiTransparentCard raised>
                <CardContent>
                  <Typography>{movie.overview}</Typography>
                </CardContent>
              </SemiTransparentCard>
            )}
            <SemiTransparentCard>
              {children}
            </SemiTransparentCard>
          </Stack>
        </Grid2>
        <Grid2 size={12}>
          <Stack direction="row" spacing={2} justifyContent="center">
            {actions}
          </Stack>
        </Grid2>
      </Grid2>
    </>
  )
}