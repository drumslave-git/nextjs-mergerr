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

export type TMDBImageProps = {
  item: {
    poster_path: string | null,
    backdrop_path: string | null,
    title: string
  },
  type: 'poster' | 'backdrop',
  size: number,
  sx?: SxProps
}

export const TMDBImage = ({item, type, size, sx}: TMDBImageProps) => {
  const {ok, configuration, formatImagePath} = useTMDBApi()

  const path = useMemo(() => {
    return item[`${type}_path`]
  }, [item, type])

  if(!ok || !configuration || !path) {
    return null
  }

  return <Img src={formatImagePath(path, configuration.images[`${type}_sizes`].at(size) || '')} alt={item.title} sx={sx} />
}