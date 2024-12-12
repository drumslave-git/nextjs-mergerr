import {Movie} from "@/common/api/Radarr/entities/MovieAPI"
import {MovieResult} from "@/common/api/TMDB/entities/SearchAPI"
import {useTMDBApi} from "@/components/TMDBApiProvider"
import {SxProps} from "@mui/material/styles"
import styled from "@mui/material/styles/styled"
import {useMemo} from "react"

const Img = styled('img')(() => ({
  width: '100%',
  height: 'auto',
  objectFit: 'cover',
  borderRadius: '4px',
}))

const BaseImage = ({movie, type, size, sx}: {movie: Movie | MovieResult, type: 'poster' | 'backdrop', size: number, sx?: SxProps}) => {
  const {ok, configuration, formatImagePath} = useTMDBApi()
  const image = useMemo(() => {
    let result
    let searchForType: string = type
    if ((movie as Movie).tmdbId) {
      if(searchForType === 'backdrop') {
        searchForType = 'fanart'
      }
      result = (movie as Movie).images.find((image) => image.coverType === searchForType)
      result = result?.remoteUrl || ''
    }
    if (!(movie as Movie).tmdbId) {
      result = (movie as MovieResult)[`${type}_path`]
      if(!result) {
        result = ''
      }
      result = formatImagePath(result, type, size)
    }

    return result
  }, [formatImagePath, movie, size, type])

  if(!ok && !configuration && !(movie as Movie).tmdbId) {
    return null
  }

  return <Img src={image} alt={movie.title} sx={sx} />
}

export const PosterImage = ({movie, size, sx}: {movie: Movie | MovieResult, size: number, sx?: SxProps}) => {
  return <BaseImage movie={movie} type="poster" size={size} sx={sx} />
}

export const BackdropImage = ({movie, size, sx}: {movie: Movie | MovieResult, size: number, sx?: SxProps}) => {
  return <BaseImage movie={movie} type="backdrop" size={size} sx={sx} />
}