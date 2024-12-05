'use client'

import {MovieAddSetting, MovieResponse} from "@/common/api/Radarr/entities/MovieAPI"
import {QualityProfile} from "@/common/api/Radarr/entities/QualityProfileAPI"
import {RootFolder} from "@/common/api/Radarr/entities/RootFolderAPI"
import {Genre} from "@/common/api/TMDB/entities/GenresAPI"
import {MovieResult} from "@/common/api/TMDB/entities/SearchAPI"
import CircularProgressWithLabel from "@/components/common/CircularProgressWithLabel"
import InfinitProgressOverlay from "@/components/common/InfinitProgressOverlay"
import Grid, {Item} from "@/components/common/ItemsLayout/Grid"
import ModalPopup from "@/components/common/ModalPopup"
import {TMDBImage} from "@/components/common/TMDB/Image"
import Rating from "@/components/common/TMDB/Rating"
import {useNotifications} from "@/components/NotificationsProvider"
import {useTMDBApi} from "@/components/TMDBApiProvider"
import CheckCircle from "@mui/icons-material/CheckCircle"
import {FormControlLabel, Switch} from "@mui/material"
import LinearProgress from "@mui/material/LinearProgress"
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
import { ReactNode, memo, useCallback, useEffect, useMemo, useRef, useState, use } from "react";
import {alpha } from "@mui/material/styles"

const SearchIconButton = styled(IconButton)(() => ({
  aspectRatio: 1,
  height: '100%',
  alignSelf: 'center',
}))

const getReleaseYear = (releaseDate?: string) => {
  if (!releaseDate) {
    return ''
  }
  return new Date(releaseDate).getFullYear()
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

const SemiTransparentCard = styled(Card)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.9),
}))

const Details = ({id, appId, onClose}: { id: number, appId: string, onClose: (tmdbId?: number) => void }) => {
  const {addNotification} = useNotifications()

  const [details, setDetails] = useState<MovieResult | null>(null)
  const [addingMovie, setAddingMovie] = useState(false)
  const [app, setApp] = useState<App | null>(null)
  const [addedMovie, setAddedMovie] = useState<boolean | undefined>(undefined)
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

  const releaseYear = useMemo(() => {
    if(!details) {
      return ''
    }
    return getReleaseYear(details.release_date)
  }, [details])

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
    fetch(`/api/app/${appId}/movie?tmdbId=${id}`).then(res => res.json()).then(data => {
      setAddedMovie(data.length > 0)
    })
  }, [appId, id])

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
    const options: Record<string, any> = {}
    if(rootFolders.length > 0) {
      options['rootFolderPath'] = rootFolders[0].path
    }
    if(qualityProfiles.length > 0) {
      options['qualityProfileId'] = qualityProfiles[0].id
    }
    setNewMovie((prev) =>
      ({...prev, options: {...prev.options, ...options}})
    )
  }, [qualityProfiles, rootFolders])

  const changeNewMovieOption = useCallback((key: string, value: any) => {
    setNewMovie((prev) => {
      const newOptions = { ...prev.options } // Clone the existing options
      const keys = key.split('.')
      let currentPart: any = newOptions

      // Traverse to the correct depth
      keys.forEach((part, index) => {
        if (index === keys.length - 1) {
          // If it's the last key, set the value
          currentPart[part] = value
        } else {
          // If the part doesn't exist, create it as an object
          currentPart[part] = { ...currentPart[part] }
          currentPart = currentPart[part]
        }
      })

      return {
        ...prev,
        options: newOptions,
      }
    })
  }, [])
  
  const addMovie = useCallback(() => {
    setAddingMovie(true)
    fetch(`/api/app/${appId}/movie`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newMovie)
    }).then(res => res.json()).then(data => {
      if(data.tmdbId) {
        addNotification({
          title: 'Success',
          message: 'Movie added successfully',
          type: 'success'
        })
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
      .finally(() => {
        setAddingMovie(false)
      })
  }, [addNotification, appId, newMovie, onClose])

  const onCloseHandler = useCallback(() => {
    if (!addingMovie) {
      onClose()
    }
  }, [addingMovie, onClose])

  return (
    <ModalPopup onClose={onCloseHandler}>
      {details && addedMovie !== undefined ? (
        <Grid2 container spacing={2} padding={2}>
          {addingMovie && <InfinitProgressOverlay zIndex={3} />}
          <Grid2 size={{xs: 12, sm: 5, md: 4}}>
            <TMDBImage item={details} type="poster" size={-1} />
          </Grid2>
          <Grid2 size={{xs: 12, sm: 7, md: 8}} sx={{position: 'relative'}}>
            <TMDBImage item={details} type="backdrop" size={-1} sx={{position: 'absolute', maxHeight: '50%', zIndex: 1, opacity: .5}} />
            <Stack direction="column" spacing={2} sx={{zIndex: 2, position: 'relative'}}>
              <SemiTransparentCard raised>
                <CardContent>
                  <Typography variant="h6">{`${details.title}${releaseYear ? ` (${releaseYear})` : ''}`}</Typography>
                </CardContent>
              </SemiTransparentCard>
              <SemiTransparentCard raised>
                <CardContent>
                  <Link href={`https://www.themoviedb.org/movie/${id}`} target="_blank">
                    <Chip label="TMDB" />
                  </Link>
                </CardContent>
              </SemiTransparentCard>
              {details.overview && (
                <SemiTransparentCard raised>
                  <CardContent>
                    <Typography>{details.overview}</Typography>
                  </CardContent>
                </SemiTransparentCard>
              )}
              {!addedMovie && (
                <SemiTransparentCard raised>
                  <CardContent>
                    <Stack direction="column" spacing={2} paddingTop={2}>
                      {rootFolders.length > 0 && (
                        <FormControl fullWidth>
                          <InputLabel>Root Folder</InputLabel>
                          <Select
                            value={newMovie.options.rootFolderPath}
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
                            value={newMovie.options.qualityProfileId}
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
                          value={newMovie.options.addOptions.monitor}
                          label="Monitor"
                          onChange={e => changeNewMovieOption('addOptions.monitor', e.target.value)}
                        >
                          <MenuItem value="movieOnly">Movie</MenuItem>
                          <MenuItem value="movieAndCollection">Movie and Collection</MenuItem>
                          <MenuItem value="none">None</MenuItem>
                        </Select>
                      </FormControl>
                    </Stack>
                  </CardContent>
                </SemiTransparentCard>
              )}
            </Stack>
          </Grid2>
          {app && (
            <Stack justifyContent="center" direction="row" width="100%">
              {addedMovie
                ? (
                  <Link href={`${app.public_url || app.url}/movie/${id}`} target="_blank" passHref>
                    <Button variant="contained" color="success">View in {app.name}</Button>
                  </Link>
                )
                : (
                  <Button variant="contained" onClick={addMovie} color="primary">Add to {app.name}</Button>
                )
              }
            </Stack>
          )}
        </Grid2>
      ) : (
        <LinearProgress />
      )}
    </ModalPopup>
  )
}

const AdditionalInfo = ({item, results, appId}: { item: Item, results: MovieResult[], appId: string }) => {
  const [addedMovie, setAddedMovie] = useState(false)

  const result = useMemo(() => {
    return results.find(r => r.id === Number(item.id)) as MovieResult
  }, [item.id, results])

  useEffect(() => {
    fetch(`/api/app/${appId}/movie?tmdbId=${item.id}`).then(res => res.json()).then(data => {
      setAddedMovie(data.length > 0)
    })
  }, [appId, item.id])

  if (!result) {
    return null
  }

  return (
    <Stack direction="row" spacing={2} justifyContent="space-between" paddingTop={2}>
      <Rating value={result.vote_average} />
      <CheckCircle fontSize="large" sx={{width: '40px', height: '40px'}} color={addedMovie ? 'success' : 'error'} />
    </Stack>
  )
}

const SearchResults = (props: { results: MovieResult[], items: Item[], appId: string, onClick: (id: number) => void }) => {
  const {results, items, appId, onClick} = props

  return (
    <Grid
      items={items}
      aspectRatio={.5}
      ActionComponent={({item, children}) => <ActionComponent item={item} onClick={onClick}>{children}</ActionComponent>}
      AdditionalContentComponent={({item}) => <AdditionalInfo item={item} results={results} appId={appId} />}
    />
  )
}

export default function SearchPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const searchParams = useSearchParams()

  const [results, setResults] = useState<MovieResult[] | undefined>(undefined)
  const [items, setItems] = useState<Item[]>([])
  const [genres, setGenres] = useState<Genre[] | null>(null)
  const [searching, setSearching] = useState(false)
  const [detailsForID, setDetailsForID] = useState<number | null>(null)
  const [hideAdded, setHideAdded] = useState(false)
  const [hideJAV, setHideJAV] = useState(false)

  const {ok, configuration, formatImagePath} = useTMDBApi()

  const eventSource = useRef<EventSource>(undefined)

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
    if(!results) {
      setItems([])
      return
    }
    setItems(results.map((result: MovieResult) => {
      const releaseYear = getReleaseYear(result.release_date)
      return {
        id: result.id,
        title: `${result.title}${releaseYear ? ` (${releaseYear})` : ''}`,
        image: result.poster_path ? formatImagePath(result.poster_path, configuration?.images.poster_sizes.at(1) || '') : undefined
      }
    }))
  }, [configuration?.images.poster_sizes, formatImagePath, results])

  const search = useCallback((e: any) => {
    if (e.preventDefault) {
      e.preventDefault()
    }
    setResults(undefined)
    let term = e
    if(typeof term !== 'string') {
      const formData = new FormData(term.target)
      term = formData.get('term') as string
    }
    if (!term) {
      return
    }

    if (eventSource.current) {
      eventSource.current.close()
      eventSource.current = undefined
    }

    eventSource.current = new EventSource(`/api/app/${params.id}/search/${encodeURIComponent(term)}/tmdb`)

    eventSource.current.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setResults(prev => prev ? [...prev, ...data.results] : data.results)
    }

    eventSource.current.onerror = () => {
      if (eventSource.current) {
        eventSource.current.close()
        eventSource.current = undefined
      }
      setSearching(false)
    }

  }, [params])

  useEffect(() => {
    const term = searchParams.get('term')
    if(term) {
      search(term)
    }
  }, [search, searchParams])

  const onDetailsClose = useCallback(() => {
    setDetailsForID(null)
  }, [])

  const onHideAddedChange = useCallback((e: any) => {
    setHideAdded(e.target.checked)
  }, [])

  const onHideJAVChange = useCallback((e: any) => {
    setHideJAV(e.target.checked)
  }, [])

  if (!ok || !genres) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <Stack spacing={2}>
      <Card>
        <form onSubmit={search}>
          <CardContent>
            <Stack direction="row" spacing={2}>
              <TextField label="Search" variant="standard" name="term" defaultValue={searchParams.get('term')}
                         fullWidth/>
              <SearchIconButton type="submit">
                <SearchIcon />
              </SearchIconButton>
            </Stack>
            <Stack direction="row" spacing={2}>
              <FormControlLabel control={<Switch value={hideAdded} onChange={onHideAddedChange} />} label="Hide Added" />
              <FormControlLabel control={<Switch value={hideJAV} onChange={onHideJAVChange} />} label="Hide JAV" />
            </Stack>
          </CardContent>
        </form>
      </Card>
      <Card>
        {searching && (
          <LinearProgress />
        )}
        <CardContent>
          {results && results.length === 0 && (
            <Typography>{`no results found`}</Typography>
          )}
          {results && (
            <SearchResults results={results} items={items} appId={params.id} onClick={setDetailsForID} />
          )}
        </CardContent>
      </Card>
      {detailsForID && (
        <Details id={detailsForID} appId={params.id} onClose={onDetailsClose} />
      )}
    </Stack>
  )
}