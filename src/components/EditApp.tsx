'use client'
import Box from "@mui/material/Box"
import {useRouter} from "next/navigation"
import {useCallback, useEffect, useState} from "react"
import Paper from '@mui/material/Paper'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import {App} from '@prisma/client'
import CheckIcon from '@mui/icons-material/Check'

import {AppType} from "@/consts"

const defaultApp: App = {
  id: '',
  name: '',
  type: AppType.radarr,
  api_key: '',
  url: '',
}

export default function EditApp({app}: { app?: App }) {
  const [appConfig, setAppConfig] = useState<App>(app || defaultApp)
  const [tested, setTested] = useState<boolean>(false)
  const [disableButtons, setDisableButtons] = useState<boolean>(true)

  const router = useRouter()

  const onChange = useCallback((e: any) => {
    setAppConfig((prev) => ({...prev, [e.target.name]: e.target.value}))
  }, [])

  const onTest = useCallback(() => {
    fetch('/api/app/test', {
      method: 'POST',
      body: JSON.stringify(appConfig),
    }).then(res => res.json()).then(data => {
      setTested(true)
    }).catch(err => {
      console.error(err)
      setTested(false)
    })
  }, [appConfig])

  const onSave = useCallback(() => {
    setDisableButtons(true)
    fetch('/api/app/save', {
      method: 'POST',
      body: JSON.stringify(appConfig),
    }).then(res => res.json()).then(data => {
      router.push(`/apps/${data.id}`)
    }).catch(err => {
      console.error(err)
    })
      .finally(() => {
        setTested(false)
        setDisableButtons(false)
      })
  }, [appConfig, router])

  useEffect(() => {
    setTested(false)
    setDisableButtons(!appConfig.name || !appConfig.url || !appConfig.api_key)
  }, [appConfig])

  return (
    <>
      <Paper>
        <Box sx={{p: 2, display: 'flex', flexDirection: 'row', gap: 2}}>
          <TextField label="Name" name="name" value={appConfig.name} onChange={onChange} fullWidth/>
          <FormControl fullWidth>
            <InputLabel id="app-type-label">Type</InputLabel>
            <Select
              labelId="app-type-label"
              value={appConfig.type}
              label="Type"
              name="type"
              onChange={onChange}
            >
              {Object.values(AppType).map((type) => (
                <MenuItem value={type} key={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{p: 2, display: 'flex', flexDirection: 'row', gap: 2}}>
          <TextField label="Url" name="url" value={appConfig.url} onChange={onChange} fullWidth/>
          <TextField label="Api Key" name="api_key" value={appConfig.api_key} onChange={onChange} fullWidth/>
        </Box>
      </Paper>
      <Box sx={{display: 'flex', justifyContent: 'center', mt: 2}}>
        <Button variant="contained" color="secondary" onClick={onTest} disabled={disableButtons || tested}>
          {tested ? <CheckIcon color="success"/> : 'Test'}
        </Button>
        {tested && <Button variant="contained" color="primary" disabled={disableButtons} onClick={onSave}>Save</Button>}
      </Box>
    </>
  )
}