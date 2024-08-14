'use client'

import Chip from "@mui/material/Chip"
import {useEffect, useState} from "react"

const Version = () => {
  const [version, setVersion] = useState<string>('')
  useEffect(() => {
    fetch('/api/version').then(res => res.json()).then(data => {
      setVersion(data.version)
    })
  }, [])

  if (!version) {
    return null
  }

  return (
    <Chip label={version} color="info" size="small" />
  )
}

export default Version