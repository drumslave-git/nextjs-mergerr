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
  public_url: '',
}

const REQUIRED_FIELDS: Array<keyof App> = ['name', 'type', 'url', 'api_key']

const validate = (app: App) => {
  const errors: Record<string, string> = {}
  REQUIRED_FIELDS.forEach((field) => {
    if (!app[field]) {
      errors[field] = 'Field is required'
    }
  })
  return errors
}

export default function EditApp({app}: { app?: App }) {
  const [appConfig, setAppConfig] = useState<App>(app || defaultApp)
  const [tested, setTested] = useState<boolean>(false)
  const [disableButtons, setDisableButtons] = useState<boolean>(true)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const router = useRouter()

  const onChange = useCallback((e: any) => {
    setErrors(prev => {
      const {[e.target.name]: _, ...rest} = prev
      return rest
    })
    setAppConfig((prev) => ({...prev, [e.target.name]: e.target.value}))
  }, [])

  const onTest = useCallback(() => {
    const errors = validate(appConfig)
    if (Object.keys(errors).length) {
      setErrors(errors)
      return
    }
    setDisableButtons(true)
    fetch('/api/app/test', {
      method: 'POST',
      body: JSON.stringify(appConfig),
    }).then(res => res.json()).then(data => {
      setTested(true)
    }).catch(err => {
      console.error(err)
      setTested(false)
    })
      .finally(() => {
        setDisableButtons(false)
      })
  }, [appConfig])

  const onSave = useCallback(() => {
    const errors = validate(appConfig)
    if (Object.keys(errors).length) {
      setErrors(errors)
      return
    }
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
    const errors = validate(appConfig)
    setDisableButtons(Object.keys(errors).length > 0)
  }, [appConfig])

  return (
    <>
      <Paper>
        <Box sx={{p: 2, display: 'flex', flexDirection: 'row', gap: 2}}>
          <TextField required error={!!errors.name} label="Name" name="name" value={appConfig.name} onChange={onChange} fullWidth/>
          <FormControl fullWidth>
            <InputLabel id="app-type-label">Type</InputLabel>
            <Select
              required
              error={!!errors.type}
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
          <TextField required error={!!errors.url} label="Url" name="url" value={appConfig.url} onChange={onChange} fullWidth/>
          <TextField error={!!errors.public_url} label="Public Url" name="public_url" value={appConfig.public_url} onChange={onChange} fullWidth/>
          <TextField required error={!!errors.api_key} label="Api Key" name="api_key" value={appConfig.api_key} onChange={onChange} fullWidth/>
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