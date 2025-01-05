'use client'

import InfinitProgressOverlay from "@/components/common/InfinitProgressOverlay"
import {useTMDBApi} from "@/components/TMDBApiProvider"
import {useTPDBApi} from "@/components/TPDBApiProvider"
import {CardActions, CardHeader} from "@mui/material"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import TextField from "@mui/material/TextField"
import {useEffect, useState} from "react"

export default function SettingsPage() {
  const [tmdbKey, setTMDBKey] = useState('')
  const [tpdbKey, setTPDBKey] = useState('')
  const [loading, setLoading] = useState(true)
  const {ok: tmdbOK, saveKey: saveTMDBKey} = useTMDBApi()
  const {user: tpdbUser, saveKey: saveTPDBKey} = useTPDBApi()

  useEffect(() => {
    Promise.all([
      fetch('/api/tmdb/config').then(res => res.json()).then(data => {
        setTMDBKey(data.key)
      }),
      fetch('/api/tpdb/config').then(res => res.json()).then(data => {
        setTPDBKey(data.key)
      })
    ]).finally(() => {
      setLoading(false)
    })
  }, [])

  const onSaveTMDBKey = () => {
    setLoading(true)
    saveTMDBKey(tmdbKey)
    .then(() => {
      setLoading(false)
    })
  }

  const onSaveTPDBKey = () => {
    setLoading(true)
    saveTPDBKey(tpdbKey)
    .then(() => {
      setLoading(false)
    })
  }

  return (
      <Box position="relative">
        {loading && (
          <InfinitProgressOverlay />
        )}
        <Card>
          <CardHeader title="TMDB" />
          <CardContent>
            <TextField
              required
              margin="dense"
              id="tmdbApiKey"
              name="tmdbApiKey"
              label="TMDB API Key"
              type="text"
              fullWidth
              variant="standard"
              error={tmdbOK === false}
              value={tmdbKey}
              onChange={e => setTMDBKey(e.target.value)}
            />
          </CardContent>
          <CardActions>
            <Button onClick={onSaveTMDBKey}>Save</Button>
          </CardActions>
        </Card>
        <Card>
          <CardHeader title="TPDB" />
          <CardContent>
            <TextField
              required
              margin="dense"
              id="tpdbApiKey"
              name="tpdbApiKey"
              label="TPDB API Key"
              type="text"
              fullWidth
              variant="standard"
              error={tpdbUser === null}
              value={tpdbKey}
              onChange={e => setTPDBKey(e.target.value)}
            />
          </CardContent>
          <CardActions>
            <Button onClick={onSaveTPDBKey}>Save</Button>
          </CardActions>
        </Card>
      </Box>
  )
}