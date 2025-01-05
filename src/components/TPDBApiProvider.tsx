'use client'

import {User} from "@/common/api/TPDB/types"
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

const TPDBApiContext = createContext<{user: User | null | undefined, saveKey: (key: string) => Promise<void>}>({
  user: undefined,
  saveKey: (key: string) => Promise.resolve()
})

export function TPDBApiProvider({children}: { children: ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined)

  const {addNotification} = useNotifications()

  const makeTest = useCallback(() => {
    fetch('/api/tpdb/user')
      .then(res => {
        if(res.status !== 200) {
          setUser(null)
          addNotification({
            title: 'TMDB Error',
            type: 'error',
            message: `${res.status} ${res.statusText}`
          })
        } else {
          res.json().then(data => {
            setUser(data)
          })
        }
      })
  }, [addNotification])

  useEffect(() => {
    makeTest()
  }, [makeTest])

  const onSubmit = useCallback(async (apiKey: string) => {
    await fetch('/api/tpdb/config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({key: apiKey})
    })
    return makeTest()
  }, [makeTest])

  return (
    <TPDBApiContext.Provider value={{user, saveKey: onSubmit}}>
      {children}
    </TPDBApiContext.Provider>
  )
}

export function useTPDBApi() {
  return useContext(TPDBApiContext)
}