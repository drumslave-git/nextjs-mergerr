'use client'

import {MovieAddSetting, MovieResponse} from "@/common/api/Radarr/entities/MovieAPI"
import {QualityProfile} from "@/common/api/Radarr/entities/QualityProfileAPI"
import {RootFolder} from "@/common/api/Radarr/entities/RootFolderAPI"
import {Genre} from "@/common/api/TMDB/entities/GenresAPI"
import {MovieResult} from "@/common/api/TMDB/entities/SearchAPI"
import CircularProgressWithLabel from "@/components/common/CircularProgressWithLabel"
import Grid, {Item} from "@/components/common/ItemsLayout/Grid"
import ModalPopup from "@/components/common/ModalPopup"
import {useNotifications} from "@/components/NotificationsProvider"
import {useTMDBApi} from "@/components/TMDBApiProvider"
import CheckCircle from "@mui/icons-material/CheckCircle"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import InputLabel from "@mui/material/InputLabel"
import FormControl from "@mui/material/FormControl"
import Grid2 from "@mui/material/Grid2"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Chip from "@mui/material/Chip"
import styled from "@mui/material/styles/styled"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import SearchIcon from '@mui/icons-material/Search'
import Stack from '@mui/material/Stack'
import {App} from "@prisma/client"
import Link from "next/link"
import {useSearchParams} from "next/navigation"
import {ReactNode, useCallback, useEffect, useMemo, useRef, useState} from "react"
import { SxProps } from "@mui/material/styles"

const Img = styled('img')(() => ({
  width: '100%',
  height: 'auto',
  objectFit: 'cover',
}))

const SearchIconButton = styled(IconButton)(() => ({
  aspectRatio: 1,
  height: '100%',
  alignSelf: 'center',
}))

const TMDBImage = ({item, type, size, sx}: {item: MovieResult, type: 'poster', size: number, sx?: SxProps}) => {
  const {ok, configuration, formatImagePath} = useTMDBApi()

  const path = useMemo(() => {
    return item[`${type}_path`]
  }, [item, type])

  if(!ok || !configuration) {
    return null
  }

  return path ? (
    <Img src={formatImagePath(path, configuration.images[`${type}_sizes`].at(size) || '')} alt={item.title} sx={sx} />
  ) : (
    <Typography>No image</Typography>
  )
}

const ActionComponent = ({item, children, onClick}: { item: Item, children: ReactNode, onClick: (id: number) => void }) => {
  const onClickHandler = useCallback(() => {
    onClick(Number(item.id))
  }, [item.id, onClick])
  return (
    <Stack onClick={onClickHandler} sx={{height: '100%', cursor: 'pointer'}}>
      {children}
    </Stack>
  )
}

const Details = ({id, movies, appId, onClose}: { id: number, movies: MovieResponse[], appId: string, onClose: (tmdbId?: number) => void }) => {
  const {addNotification} = useNotifications()

  const [details, setDetails] = useState<MovieResult | null>(null)
  const [app, setApp] = useState<App | null>(null)
  const [newMovie, setNewMovie] = useState<{tmdbId: string, options: MovieAddSetting}>({
    tmdbId: String(id),
    options: {
      qualityProfileId: 1,
      minimumAvailability: 'released',
      rootFolderPath: '',
      monitored: true,
      addOptions: {
        searchForMovie: true,
        monitor: 'movieOnly'
      },
      tags: []
    },
  })
  const [rootFolders, setRootFolders] = useState<RootFolder[]>([])
  const [qualityProfiles, setQualityProfiles] = useState<QualityProfile[]>([])

  const addedMovie = useMemo(() => {
    return movies.find(m => m.tmdbId === id)
  }, [id, movies])

  useEffect(() => {
    fetch(`/api/app/${appId}`).then(res => res.json()).then(data => {
      setApp(data)
    })
  }, [appId])

  useEffect(() => {
    fetch(`/api/tmdb/movie/${id}`)
      .then(res => res.json())
      .then(data => {
        setDetails(data)
      })
  }, [id])

  useEffect(() => {
    if(!addedMovie) {
      fetch(`/api/app/${appId}/rootFolder`).then(res => res.json()).then(data => {
        setRootFolders(data)
      })
      fetch(`/api/app/${appId}/qualityProfile`).then(res => res.json()).then(data => {
        setQualityProfiles(data)
      })
    }
  }, [addedMovie, appId])

  useEffect(() => {
    setNewMovie((prev) => ({...prev, options: {...prev.options, rootFolderPath: rootFolders[0]?.path, qualityProfileId: qualityProfiles[0]?.id}}))
  }, [qualityProfiles, rootFolders])

  const changeNewMovieOption = useCallback((key: string, value: any) => {
    setNewMovie((prev) => ({...prev, options: {...prev.options, [key]: value}}))
  }, [])
  
  const addMovie = useCallback(() => {
    fetch(`/api/app/${appId}/movie`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newMovie)
    }).then(res => res.json()).then(data => {
      if(data.tmdbId) {
        onClose(data.tmdbId)
      } else {
        if (data.postedDataWas) {
          console.error('Failed to add movie', data)
        }
        if(data.errors && data.errors.length > 0) {
          data.errors.forEach((error: {errorMessage: string}) => {
            addNotification({
              title: 'Error',
              message: error.errorMessage,
              type: 'error'
            })
          })
        } else if (data.message) {
          addNotification({
            title: 'Error',
            message: data.message,
            type: 'error'
          })
        }
      }
    })
  }, [addNotification, appId, newMovie, onClose])

  return (
    <ModalPopup onClose={() => onClose()}>
      {details ? (
        <Grid2 container spacing={2} padding={2}>
          <Grid2 size={{xs: 12, sm: 5, md: 4}}>
            <TMDBImage item={details} type="poster" size={-1} />
          </Grid2>
          <Grid2 size={{xs: 12, sm: 7, md: 8}}>
            <Stack direction="column" spacing={2}>
              <Card raised>
                <CardContent>
                  <Typography variant="h6">{details.title}</Typography>
                </CardContent>
              </Card>
              <Card raised>
                <CardContent>
                  <Link href={`https://www.themoviedb.org/movie/${id}`} target="_blank">
                    <Chip label="TMDB" />
                  </Link>
                </CardContent>
              </Card>
              {details.overview && (
                <Card raised>
                  <CardContent>
                    <Typography>{details.overview}</Typography>
                  </CardContent>
                </Card>
              )}
              {!addedMovie && (
                <Card raised>
                  <CardContent>
                    {rootFolders.length > 0 && (
                      <FormControl fullWidth>
                        <InputLabel>Root Folder</InputLabel>
                        <Select
                          value={rootFolders[0].path}
                          label="Root Folder"
                          onChange={e => changeNewMovieOption('rootFolderPath', e.target.value)}
                        >
                          {rootFolders.map(folder => (
                            <MenuItem key={folder.id} value={folder.path}>{folder.path}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                    {qualityProfiles.length > 0 && (
                      <FormControl fullWidth>
                        <InputLabel>Quality Profile</InputLabel>
                        <Select
                          value={qualityProfiles[0].id}
                          label="Root Folder"
                          onChange={e => changeNewMovieOption('qualityProfileId', e.target.value)}
                        >
                          {qualityProfiles.map(qualityProfile => (
                            <MenuItem key={qualityProfile.id} value={qualityProfile.id}>{qualityProfile.name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                    <FormControl fullWidth>
                      <InputLabel>Monitor</InputLabel>
                      <Select
                        value="movieOnly"
                        label="Monitor"
                        onChange={e => changeNewMovieOption('addOptions.addOptions', e.target.value)}
                      >
                        <MenuItem value="movieOnly">Movie</MenuItem>
                        <MenuItem value="movieAndCollection">Movie and Collection</MenuItem>
                        <MenuItem value="none">None</MenuItem>
                      </Select>
                    </FormControl>
                  </CardContent>
                </Card>
              )}
            </Stack>
          </Grid2>
          {app && (
            <>
              {addedMovie
                ? (
                  <Link href={`${app.public_url || app.url}/movie/${addedMovie.tmdbId}`} target="_blank" passHref>
                    <Button color="success">View in {app.name}</Button>
                  </Link>
                )
                : (
                  <Button onClick={addMovie} color="primary">Add to {app.name}</Button>
                )
              }
            </>
          )}
        </Grid2>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </ModalPopup>
  )
}

const AdditionalInfo = ({item, movies, results}: { item: Item, movies: MovieResponse[], results: MovieResult[] }) => {
  const result = useMemo(() => {
    return results.find(r => r.id === Number(item.id)) as MovieResult
  }, [item.id, results])
  const addedMovie = useMemo(() => {
    return movies.find(m => m.tmdbId === Number(item.id))
  }, [item.id, movies])

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
    <Stack direction="row" spacing={2} position="absolute" sx={{right: '1rem', top: '1rem'}}>
      {result.vote_average > 0 && (
        <CircularProgressWithLabel value={result.vote_average * 10} color={voteColor} label={result.vote_average} thickness={5} />
      )}
      <CheckCircle color={addedMovie ? 'success' : 'error'} />
    </Stack>
  )

}

const SearchResults = (props: { results: MovieResult[], items: Item[], movies: MovieResponse[], onClick: (id: number) => void }) => {
  const {results, items, movies, onClick} = props

  return (
    <Grid
      items={items}
      ActionComponent={({item, children}) => <ActionComponent item={item} onClick={onClick}>{children}</ActionComponent>}
      AdditionalContentComponent={({item}) => <AdditionalInfo item={item} results={results} movies={movies} />}
    />
  )
}

export default function SearchPage({params}: { params: { id: string } }) {
  const searchParams = useSearchParams()

  const [results, setResults] = useState<MovieResult[] | undefined>(undefined)
  const [movies, setMovies] = useState<MovieResponse[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [genres, setGenres] = useState<Genre[] | null>(null)
  const [query, setQuery] = useState(searchParams.get('term') || '')
  const [searching, setSearching] = useState(false)
  const [detailsForID, setDetailsForID] = useState<number | null>(null)

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

  useEffect(() => {
    if(results) {
      Promise.all(results.map(result => fetch(`/api/app/${params.id}/movie?tmdbId=${result.id}`).then(res => res.json())))
        .then(data => {
          setMovies(data.filter((movies: MovieResponse[]) => !!movies.at(0)).map((movies: MovieResponse[]) => movies.at(0) as MovieResponse))
        })
    }
  }, [params.id, results])

  const search = useCallback(() => {
    setSearching(true)
    setResults(undefined)
    setItems([])
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

  const onDetailsClose = useCallback((tmdbId?: number) => {
    if(tmdbId) {
      fetch(`/api/app/${params.id}/movie?tmdbId=${tmdbId}`).then(res => res.json())
        .then(data => {
          setMovies((prev) => [...prev, data.at(0) as MovieResponse])
        })
    }
    setDetailsForID(null)
  }, [params.id])

  const onQueryChange = useCallback((e: any) => {
    setQuery(e.target.value)
  }, [])

  if (!ok || !genres) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <Stack spacing={2}>
      <Card>
        <CardContent>
          <Stack direction="row" spacing={2}>
            <TextField label="Search" variant="standard" value={query} onChange={onQueryChange}
                       fullWidth/>
            <SearchIconButton aria-label="delete" onClick={search}>
              <SearchIcon />
            </SearchIconButton>
          </Stack>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          {results && results.length === 0 && (
            <Typography>{`no results for: ${query}`}</Typography>
          )}
          {results && (
            <SearchResults results={results} movies={movies} items={items} onClick={setDetailsForID} />
          )}
        </CardContent>
      </Card>
      {detailsForID && (
        <Details id={detailsForID} movies={movies} appId={params.id} onClose={onDetailsClose} />
      )}
    </Stack>
  )
}