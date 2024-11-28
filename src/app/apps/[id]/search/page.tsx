'use client'

import {Genre} from "@/common/api/TMDB/entities/GenresAPI"
import {MovieResult} from "@/common/api/TMDB/entities/SearchAPI"
import CircularProgressWithLabel from "@/components/common/CircularProgressWithLabel"
import Grid, {Item} from "@/components/common/ItemsLayout/Grid"
import ModalPopup from "@/components/common/ModalPopup"
import {useTMDBApi} from "@/components/TMDBApiProvider"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Chip from "@mui/material/Chip"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import SearchIcon from '@mui/icons-material/Search'
import Stack from '@mui/material/Stack'
import useTheme from "@mui/material/styles/useTheme"
import Link from "next/link"
import {ReactNode, useCallback, useEffect, useMemo, useState} from "react"

const TMDBImage = ({item, type, size}: {item: MovieResult, type: 'poster', size: number}) => {
  const {ok, configuration, formatImagePath} = useTMDBApi()

  const path = useMemo(() => {
    return item[`${type}_path`]
  }, [item, type])

  if(!ok || !configuration) {
    return null
  }

  return path ? (
    <img src={formatImagePath(path, configuration.images[`${type}_sizes`].at(size) || '')} alt={item.title} />
  ) : (
    <Typography>No image</Typography>
  )
}

const ActionComponent = ({item, children, onClick}: { item: Item, children: ReactNode, onClick: (id: number) => void }) => {
  const onClickHandler = useCallback(() => {
    onClick(Number(item.id))
  }, [item.id, onClick])
  return (
    <Stack onClick={onClickHandler} sx={{height: '100%'}}>
      {children}
    </Stack>
  )
}

const Details = ({id, onClose}: { id: number, onClose: () => void }) => {
  const [details, setDetails] = useState<MovieResult | null>(null)
  useEffect(() => {
    fetch(`/api/tmdb/movie/${id}`)
      .then(res => res.json())
      .then(data => {
        setDetails(data)
      })
  }, [id])

  return (
    <ModalPopup title={details ? details.title : 'Loading...'} onClose={onClose}>
      {details ? (
        <>
          <TMDBImage item={details} type="poster" size={-1} />
          <Link href={`https://www.themoviedb.org/movie/${id}`} target="_blank">
            <Chip label="TMDB" />
          </Link>
          <Typography>{details.overview}</Typography>
        </>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </ModalPopup>
  )
}

const AdditionalInfo = ({item, results}: { item: Item, results: MovieResult[] }) => {
  const result = results.find(r => r.id === Number(item.id)) as MovieResult

  const voteColor = useMemo(() => {
    if(result.vote_average < 4) {
      return 'error'
    }
    if(result.vote_average < 7) {
      return 'warning'
    }
    return 'success'
  }, [result.vote_average])

  return (
    <Box position="absolute" sx={{right: '1rem', top: '1rem'}}>
      {result.vote_average > 0 && (
        <CircularProgressWithLabel value={result.vote_average * 10} color={voteColor} label={result.vote_average} thickness={5} />
      )}
    </Box>
  )

}

export default function SearchPage({params}: { params: { id: string } }) {
  const [results, setResults] = useState<MovieResult[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [genres, setGenres] = useState<Genre[] | null>(null)
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [detailsForID, setDetailsForID] = useState<number | null>(null)

  const theme = useTheme()

  const {ok, configuration, formatImagePath} = useTMDBApi()

  useEffect(() => {
    if (ok) {
      fetch(`/api/tmdb/genres/movie`)
        .then(res => res.json())
        .then(data => {
          setGenres(data.genres)
        })
    }
  }, [ok])

  const search = useCallback(() => {
    setSearching(true)
    fetch(`/api/app/${params.id}/search/${encodeURIComponent(query)}/tmdb`)
      .then(res => res.json())
      .then(data => {
        setResults(data.results)
        setItems(data.results.map((result: MovieResult) => {
          return {
            id: result.id,
            title: result.title,
            image: result.poster_path ? formatImagePath(result.poster_path, configuration?.images.poster_sizes.at(0) || '') : null
          }
        }))
        setSearching(false)
      })

  }, [query, params, configuration, formatImagePath])

  if (!ok || !genres) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <>
      <Card>
        <CardContent>
          <Stack direction="row" spacing={2}>
            <TextField label="Search" variant="standard" value={query} onChange={e => setQuery(e.target.value)}
                       fullWidth/>
            <IconButton aria-label="delete" onClick={search}>
              <SearchIcon />
            </IconButton>
          </Stack>
        </CardContent>
      </Card>
      <Card sx={{marginTop: theme.spacing(2)}}>
        <CardContent>
          {results.length === 0 && (
            <Typography>{query ? `no results for: ${query}` : 'Try to search for something'}</Typography>
          )}
          <Grid
            items={items}
            ActionComponent={({item, children}) => <ActionComponent item={item} onClick={setDetailsForID}>{children}</ActionComponent>}
            AdditionalContentComponent={({item}) => <AdditionalInfo item={item} results={results} />}
          />
        </CardContent>
      </Card>
      {detailsForID && (
        <Details id={detailsForID} onClose={() => setDetailsForID(null)} />
      )}
    </>
  )
}