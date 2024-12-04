'use client'

import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import IconButton from "@mui/material/IconButton"
import styled from "@mui/material/styles/styled"
import {useCallback, useEffect, useState} from "react"

const FABButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  backgroundColor: theme.palette.secondary.main,
  '&:hover': {
    backgroundColor: theme.palette.secondary.light,
  }
}))

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  const toggleVisibility = useCallback(() => {
    if (window.scrollY > 300) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [])

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [toggleVisibility])
  
  if(!isVisible) {
    return null
  }

  return (
    <FABButton onClick={scrollToTop}>
      <ArrowUpwardIcon />
    </FABButton>
  )
}