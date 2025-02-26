'use client'

import {Movie} from "@/common/api/Radarr/entities/MovieAPI"
import {MovieResult} from "@/common/api/TMDB/entities/SearchAPI"
import {Data} from "@/common/api/TPDB/types"
import {BackdropTMDBImage, BackdropTPDBImage, PosterTMDBImage, PosterTPDBImage} from "@/components/common/MovieImage"
import {useTMDBApi} from "@/components/TMDBApiProvider"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Chip from "@mui/material/Chip"
import Grid2 from "@mui/material/Grid2"
import Stack from "@mui/material/Stack"
import {SxProps, alpha} from "@mui/material/styles"
import styled from "@mui/material/styles/styled"
import Typography from "@mui/material/Typography"
import Link from "next/link"
import {ReactNode, useMemo} from "react"

const SemiTransparentCard = styled(Card)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.55),
}))

const BGImage = ({movie, provider, sx}: {movie: Movie | MovieResult | Data, provider: 'tmdb' | 'tpdb', sx?: SxProps}) => {
  if (provider === 'tmdb') {
    return <BackdropTMDBImage movie={movie as Movie} size={-1} sx={sx} />
  }
  if (provider === 'tpdb') {
    return <BackdropTPDBImage movie={movie as Data} sx={sx} />
  }
  return null
}

const PosterImage = ({movie, provider}: {movie: Movie | MovieResult | Data, provider: 'tmdb' | 'tpdb'}) => {
  if (provider === 'tmdb') {
    return <PosterTMDBImage movie={movie as Movie} size={-1} />
  }
  if (provider === 'tpdb') {
    return <PosterTPDBImage movie={movie as Data} />
  }
  return null
}

export default function MovieCard({movie, provider, children, actions}: { movie: Movie | MovieResult | Data, provider: 'tmdb' | 'tpdb', children?: ReactNode, actions?: ReactNode }) {
  const description = useMemo(() => {
    return (movie as Movie).overview || (movie as Data).description
  }, [movie])
  return (
    <>
      <BGImage movie={movie} provider={provider} sx={{position: 'absolute', maxHeight: '50%', width: '100%', zIndex: 1, opacity: .5}} />
      <Grid2 container spacing={2} padding={2} zIndex={2} position="relative">
        <Grid2 size={{xs: 12, sm: 5, md: 4}}>
          <PosterImage provider={provider} movie={movie} />
        </Grid2>
        <Grid2 size={{xs: 12, sm: 7, md: 8}}>
          <Stack direction="column" spacing={2}>
            <SemiTransparentCard raised>
              <CardContent>
                {provider === 'tmdb' && (
                  <Link href={`https://www.themoviedb.org/movie/${(movie as Movie).tmdbId || movie.id}`} target="_blank">
                    <Chip label="TMDB" />
                  </Link>
                )}
                {provider === 'tpdb' && (
                  <Link href={`https://theporndb.net/movies/${movie.id}`} target="_blank">
                    <Chip label="TPDB" />
                  </Link>
                )}
              </CardContent>
            </SemiTransparentCard>
            {description && (
              <SemiTransparentCard raised>
                <CardContent>
                  <Typography>{description}</Typography>
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