'use client'

import {ConfigurationResponse} from "@/common/api/TMDB/entities/ConfigurationAPI"
import InfinitProgressOverlay from "@/components/common/InfinitProgressOverlay"
import {useNotifications} from "@/components/NotificationsProvider"
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import {FormEvent, ReactNode, createContext, useCallback, useContext, useEffect, useState} from "react"

export default function FormDialog({open, isLoading, onSubmit, onCancel}: {open: boolean, isLoading: boolean, onCancel: () => void, onSubmit: (...args: any[]) => void}) {

  return (
      <Dialog
        open={open}
        onClose={onCancel}
        PaperProps={{
          component: 'form',
          onSubmit: (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            const formData = new FormData(event.currentTarget)
            const formJson = Object.fromEntries((formData as any).entries())
            const apiKey = formJson.apiKey
            onSubmit(apiKey)
          },
        }}
      >
        {isLoading && <InfinitProgressOverlay zIndex={2} />}
        <DialogTitle>TMDB</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We
            will send updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="apiKey"
            label="TMDB API Key"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          {onCancel && <Button onClick={onCancel}>Cancel</Button>}
          <Button type="submit">Submit</Button>
        </DialogActions>
      </Dialog>
  )
}

type formatImagePathType = (path: string, type: 'poster' | 'backdrop', size: number) => string

const formatReleaseYear = (releaseDate?: string) => {
  if (!releaseDate) {
    return ''
  }
  return new Date(releaseDate).getFullYear().toString()
}

const TMDBApiContext = createContext<{ok: boolean | null, configuration: ConfigurationResponse | null, formatImagePath: formatImagePathType, formatReleaseYear: (releaseDate?: string) => string}>({
  ok: null,
  configuration: null,
  formatImagePath: () => '',
  formatReleaseYear
})

export function TMDBApiProvider({children}: { children: ReactNode }) {
  const [ok, setOk] = useState<boolean | null>(null)
  const [showConfigDialog, setShowConfigDialog] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [configuration, setConfiguration] = useState<ConfigurationResponse | null>(null)

  const {addNotification} = useNotifications()

  const makeTest = useCallback(() => {
    fetch('/api/tmdb/test')
      .then(res => {
        setIsLoading(false)
        setShowConfigDialog(false)
        if(res.status !== 200) {
          setOk(false)
          addNotification({
            title: 'TMDB Error',
            type: 'error',
            message: `${res.status} ${res.statusText}`
          })
          setShowConfigDialog(true)
        } else {
          fetch('/api/tmdb/configuration')
            .then(res => res.json()).then(data => {
            setConfiguration(data)
            setOk(true)
          })
        }
      })
  }, [addNotification])

  useEffect(() => {
    makeTest()
  }, [makeTest])

  const formatImagePath = useCallback<formatImagePathType>((path, type, size) => {
    if(!configuration) {
      return ''
    }
    const baseUrlTField = location.protocol === 'https:' ? 'secure_base_url' : 'base_url'
    const sizeStr = configuration.images[`${type}_sizes`].at(size) || ''

    return `${configuration.images[baseUrlTField]}${sizeStr}${path}`
  }, [configuration])

  const onSubmit = useCallback((apiKey: string) => {
    setIsLoading(true)
    fetch('/api/tmdb/config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ key: apiKey })
    })
    .then(res => res.json())
    .then(data => {
      makeTest()
    })
  }, [makeTest])

  return (
    <TMDBApiContext.Provider value={{ok, configuration, formatImagePath, formatReleaseYear}}>
      {children}
      <FormDialog open={showConfigDialog} isLoading={isLoading} onCancel={() => setShowConfigDialog(false)} onSubmit={onSubmit}  />
    </TMDBApiContext.Provider>
  )
}

export function useTMDBApi() {
  return useContext(TMDBApiContext)
}