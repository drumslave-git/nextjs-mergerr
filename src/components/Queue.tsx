'use client'

import {Item} from "@/components/common/ItemsLayout/Grid"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
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
import CardMedia from "@mui/material/CardMedia"

const Issues = ({record}: {record: QueueEntry}) => {
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

const AdditionalInfo = ({records, item}: { records: QueueEntry[], item: Item }) => {
  const record = records.find(r => r.id === item.id) as QueueEntry
  const [showInfo, setShowInfo] = useState<boolean>(false)

  const onInfoToggle = useCallback(() => {
    setShowInfo(v => !v)
  }, [])

  return <Box sx={{position: 'absolute', inset: 0}}>
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