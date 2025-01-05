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

type formatImagePathType = (path: string, type: 'poster' | 'backdrop', size: number) => string

const formatReleaseYear = (releaseDate?: string) => {
  if (!releaseDate) {
    return ''
  }
  return new Date(releaseDate).getFullYear().toString()
}

type TMDBApiContextType = {
  ok: boolean | null
  configuration: ConfigurationResponse | null
  formatImagePath: formatImagePathType
  formatReleaseYear: (releaseDate?: string) => string
  saveKey: (key: string) => Promise<void>
}

const TMDBApiContext = createContext<TMDBApiContextType>({
  ok: null,
  configuration: null,
  formatImagePath: () => '',
  formatReleaseYear,
  saveKey: (key: string) => Promise.resolve()
})

export function TMDBApiProvider({children}: { children: ReactNode }) {
  const [ok, setOk] = useState<boolean | null>(null)
  const [configuration, setConfiguration] = useState<ConfigurationResponse | null>(null)

  const {addNotification} = useNotifications()

  const makeTest = useCallback(() => {
    return fetch('/api/tmdb/test')
      .then(res => {
        if(res.status !== 200) {
          setOk(false)
          addNotification({
            title: 'TMDB Error',
            type: 'error',
            message: `${res.status} ${res.statusText}`
          })
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
    if(!path) {
      return ''
    }
    const baseUrlTField = location.protocol === 'https:' ? 'secure_base_url' : 'base_url'
    const sizeStr = configuration.images[`${type}_sizes`].at(size) || ''

    return `${configuration.images[baseUrlTField]}${sizeStr}${path}`
  }, [configuration])

  const onSubmit = useCallback(async (apiKey: string) => {
    await fetch('/api/tmdb/config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({key: apiKey})
    })
    return makeTest()
  }, [makeTest])

  return (
    <TMDBApiContext.Provider value={{ok, configuration, formatImagePath, formatReleaseYear, saveKey: onSubmit}}>
      {children}
    </TMDBApiContext.Provider>
  )
}

export function useTMDBApi() {
  return useContext(TMDBApiContext)
}