'use client'

import {Item} from "@/components/common/ItemsLayout/Grid"
import useTheme from "@mui/material/styles/useTheme"
import Chip from "@mui/material/Chip"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import Link from "next/link"
import {Fragment, ReactNode, useCallback, useEffect, useMemo, useState} from "react"
import {App} from "@prisma/client"
import Box from "@mui/material/Box"
import Grid from "@/components/common/ItemsLayout/Grid"
import Typography from "@mui/material/Typography"
import InfoIcon from "@mui/icons-material/Info"
import CloseIcon from "@mui/icons-material/Close"
import {QueueEntry} from "@/common/api/Radarr/entities/QueueAPI"

const Issues = ({record}: {record: QueueEntry}) => {
  if(!record.statusMessages) {
    return null
  }
  return (
    <List>
      {record.statusMessages.map((statusMessage, statusMessageIndex) => (
        <Fragment key={statusMessageIndex}>
          <ListItem>
            {statusMessage.title}
          </ListItem>
          {statusMessage.messages.length > 0 && (
            <List disablePadding>
              {statusMessage.messages.map((message, messageIndex) => (
                <ListItem key={messageIndex}>{message}</ListItem>
              ))}
            </List>
          )}
        </Fragment>
      ))}
    </List>
  )
}

const DownloadingChip = ({record}: {record: QueueEntry}) => {
  const theme = useTheme()

  const percentage = useMemo(() => {
    return Math.round(record.sizeleft * 100 / record.size)
  }, [record.sizeleft, record.size])

  const bgcolor = useMemo(() => {
    if(percentage === 100) {
      return theme.palette.success.main
    }
    if(percentage >= 80) {
      return theme.palette.info.main
    }
    return theme.palette.warning.main
  }, [percentage, theme])

  return <Chip sx={{position: 'relative', overflow: 'hidden'}} title={`${percentage}%`} label={
    <Box>
      <Box position="absolute" left={0} top={0} width={`${percentage}%`} height="100%" bgcolor={bgcolor} />
      <Typography position="relative">{record.trackedDownloadState}</Typography>
    </Box>
  } />
}

const Statuses = ({record}: {record: QueueEntry}) => {
  return <Box paddingTop={2}>
    <Chip label={record.status} />
    {record.trackedDownloadState && record.sizeleft > 0 && (
      <DownloadingChip record={record} />
    )}
    {record.trackedDownloadStatus && (
      <Chip label={record.trackedDownloadStatus} />
    )}
  </Box>
}

const AdditionalInfo = ({records, item}: { records: QueueEntry[], item: Item }) => {
  const record = useMemo(() => records.find(r => r.id === item.id) as QueueEntry, [records, item.id])
  const [showInfo, setShowInfo] = useState<boolean>(false)

  const onInfoToggle = useCallback((e: any) => {
    e.preventDefault()
    e.stopPropagation()
    setShowInfo(v => !v)
  }, [])

  return <>
    {record.statusMessages && (
      <Box sx={{position: 'absolute', inset: 0}}>
        {!showInfo ?
          <InfoIcon onClick={onInfoToggle} sx={{position: 'absolute', right: 0, top: 0, zIndex: 2, cursor: 'pointer'}} fontSize="large" />
          :
          <CloseIcon onClick={onInfoToggle} sx={{position: 'absolute', right: 0, top: 0, zIndex: 2, cursor: 'pointer'}} fontSize="large" />
        }
        {showInfo && (
          <Box sx={{position: 'absolute', inset: 0, zIndex: 1, bgcolor: 'background.paper', textAlign: 'left', overflow: 'auto'}}>
            <Issues record={record} />
          </Box>
        )}
      </Box>
    )}
    {/*<Statuses record={record} />*/}
  </>
}

const RecordLink = ({records, item, app, children}: { records: QueueEntry[], item: Item, app: App, children: ReactNode }) => {
  const record = records.find(r => r.id === item.id) as QueueEntry
  return <Link href={`/apps/${app.id}/queue/${record.movieId}`} passHref style={{flexDirection: 'column', display: 'flex', height: '100%', position: 'relative', textDecoration: 'none', color: 'inherit'}}>
    {children}
  </Link>
}

export default function Queue({app}: { app: App }) {
  const [records, setRecords] = useState<QueueEntry[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    fetch(`/api/app/${app.id}/queue`).then(res => res.json())
      .then(data => {
        setRecords(data.records)
        setItems(data.records.map((record: QueueEntry) => {
          let poster = record.movie?.images.find((img) => img.coverType === 'poster')?.remoteUrl
          if (!poster) {
            poster = record.movie?.images.find((img) => img.coverType === 'screenshot')?.remoteUrl
          }

          return {
            id: record.id,
            image: poster,
            title: record.movie?.title || record.title,
          }
        }))
        setLoading(false)
      })
  }, [app.id])

  if (loading) {
    return <div>Loading...</div>
  }

  if (records.length === 0) {
    return <Typography variant="h6" sx={{color: 'warning.main'}}>No records found</Typography>
  }

  return (
    <Grid
      items={items}
      ActionComponent={({item, children}) => <RecordLink records={records} item={item} app={app}>{children}</RecordLink>}
      AdditionalContentComponent={({item}) => <AdditionalInfo records={records} item={item} />}
    />
  )
}