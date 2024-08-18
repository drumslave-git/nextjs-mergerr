'use client'

import ManualImport from "@/components/ManualImport"
import Targets from "@/components/Targets"
import {ButtonGroup, Divider} from "@mui/material"
import Chip from "@mui/material/Chip"
import {MouseEvent} from "react"
import Collapse from "@mui/material/Collapse"
import Button from "@mui/material/Button"
import ListItemButton from "@mui/material/ListItemButton"
import Typography from "@mui/material/Typography"
import {App} from "@prisma/client"
import Image from "next/image"
import {useCallback, useEffect, useMemo, useState} from "react"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import ListItemIcon from "@mui/material/ListItemIcon"
import ExpandLess from "@mui/icons-material/ExpandLess"
import ExpandMore from "@mui/icons-material/ExpandMore"
import { useMergerr } from "@/components/MergerrProvider"
import {ApiEndpoints, AppType, MergeStatus} from "@/consts"

const Buttons = ({ item, onMerge, onTargetChange, onManualImport }: { item: Record<string, any>, onMerge: (e: any) => void, onTargetChange: (e: any) => void, onManualImport: (item: Record<string, any>, merge: any) => void }) => {
  const {findMergeByPath, manualImportInProgress} = useMergerr()

  const existingMerge = useMemo(() => {
    return findMergeByPath(item.mergerrOutputFile.path)
  }, [item, findMergeByPath])

  const importDisabled = useMemo(() => {
    return existingMerge?.status !== MergeStatus.done || manualImportInProgress === item.movie.id
  }, [existingMerge, item, manualImportInProgress])

  const onManualImportClick = useCallback((e: any) => {
    e.preventDefault()
    e.stopPropagation()
    onManualImport(item, existingMerge)
  }, [existingMerge, item, onManualImport])

  if (existingMerge) {
    return <Button variant="contained" color="secondary" onClick={onManualImportClick} disabled={importDisabled}>
      {manualImportInProgress === item.movie.id ? 'Importing...' : 'Import'}
    </Button>
  }


  return (
    <>
      <Button variant="contained" color={item.movie ? 'secondary' : 'primary'} onClick={onTargetChange} data-itemid={item.id}>
        {item.movie ? 'Change Target' : 'Set Target'}
      </Button>
      {item.movie && (
        <Button
          color="primary"
          variant="contained"
          onClick={onMerge}
          data-downloadid={item.downloadId}
          data-itemid={item.id}
        >Merge</Button>
      )}
    </>
  )
}

const Item = ({ item, openTarget, downloads, onMerge, onTargetChange, onManualImport, onDelete }: { item: Record<string, any>, openTarget: (id: string) => void, downloads: Record<string, any>[], onMerge: (e: any) => void, onTargetChange: (e: any) => void, onManualImport: (item: Record<string, any>, merge: any) => void, onDelete: (e: any) => void }) => {
  const [open, setOpen] = useState(false)

  const handleClick = useCallback((e: MouseEvent<HTMLAnchorElement>) => {
    if (item.movie) {
      openTarget(item.movie.foreignId)
    } else {
      onTargetChange(e)
    }
  }, [])

  const handleToggleDownloads = useCallback((e: any) => {
    e.preventDefault()
    e.stopPropagation()
    setOpen(v => !v)
  }, [])

  const poster = useMemo(() => {
    let poster = item.movie?.images.find((img: {coverType: string, remoteUrl: string}) => img.coverType === 'poster')?.remoteUrl
    if (!poster) {
      poster = item.movie?.images.find((img: {coverType: string, remoteUrl: string}) => img.coverType === 'screenshot')?.remoteUrl
    }
    return poster
  }, [item])

  return (
    <>
      <ListItemButton onClick={handleClick} href="" data-itemid={item.id}
                      sx={{
        gap: 1,
      }}
      >
        {poster && (
          <ListItemIcon>
            <Image src={poster} alt={item.movie.title} width={100} height={150} style={{objectFit: 'contain'}} />
          </ListItemIcon>
        )}
        <ListItemText inset={!!poster} primary={
          item.movie ? <>
            <Typography variant="caption">{item.movie.title}</Typography>
            &nbsp;
            <Typography variant="caption" color="text.secondary">{item.movie.year}</Typography>
          </> : 'Unknown'
        } secondary={
          <Typography variant="caption" color="text.secondary">
            {`${item.trackedDownloadState} • ${item.title}`}
          </Typography>
        } />
      </ListItemButton>
      <ListItem>
        <Divider />
        <Typography variant="caption" color="text.secondary">
          {item.mergerrOutputFile.path ? item.mergerrOutputFile.path : 'Movie not found'}
        </Typography>
        &nbsp;
        {!item.mergerrOutputFile.exists ?
          <Chip label="File Missing" color="error" variant="outlined" />
          : (
            <>
              <Chip label="File Exists" color="success" variant="outlined" />
              &nbsp;
              {item.mergerrOutputFile.imported ?
                <Chip label="Imported" color="success" variant="outlined" />
                : <Chip label="Not Imported" color="warning" variant="outlined" />
              }
            </>
          ) }
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <Divider />
            {downloads.map((download: any) => (
              <ListItem key={download.id} sx={{ pl: 4 }}>
                <ListItemText primary={download.name} secondary={download.path} />
              </ListItem>
            ))}
          <Divider />
        </List>
      </Collapse>
      <ListItem>
        <ButtonGroup fullWidth>
          <Button variant="contained" color="error" onClick={onDelete} data-itemid={item.id}>
            Delete
          </Button>
          {downloads.length > 0 && (
            <>
              <Buttons item={item} onMerge={onMerge} onTargetChange={onTargetChange} onManualImport={onManualImport} />
              <Button variant="contained" color="info" onClick={handleToggleDownloads}>
                {downloads.length} files {open ? <ExpandLess /> : <ExpandMore />}
              </Button>
            </>
          )}
        </ButtonGroup>
      </ListItem>
    </>
  )
}

export default function Queue({ app }: { app: App }) {
  const [records, setRecords] = useState<Record<string, any>[]>([])
  const [downloads, setDownloads] = useState<Record<string, Record<string, any>[]>>({})
  const [loading, setLoading] = useState<boolean>(true)
  const [targetsOpen, setTargetsOpen] = useState<null|number>(null)
  const [manualImportOpen, setManualImportOpen] = useState<Record<string, any> | null>(null)
  const {merge, listAppMerges, manualImport} = useMergerr()

  useEffect(() => {
    fetch(`/api/app/${app.id}/queue`).then(res => res.json())
      .then(data => {
        setRecords(data.records)
        setLoading(false)
        return data.records
      })
      .then((records) => {
        records.forEach((record: any) => {
          fetch(`/api/app/${app.id}/manualImport/${record.downloadId}`).then(res => res.json())
            .then(data => {
              setDownloads(prev => ({...prev, [record.downloadId]: data}))
            })
        })
      })
  }, [app])

  const onMerge = useCallback((e: any) => {
    e.preventDefault()
    e.stopPropagation()
    const downloadId = e.target.dataset.downloadid
    const itemDownloads = downloads[downloadId]
    const itemId = e.target.dataset.itemid
    const record = records.find((item: any) => item.id == itemId) as any
    merge(record, itemDownloads).then(merge => {
      listAppMerges()
    })

  }, [downloads, merge, listAppMerges, records])

  const onTargetChange = useCallback(async (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    const itemId = e.target.dataset.itemid
    const record = records.find((item: any) => item.id == itemId) as any
    setTargetsOpen(record.id)
  }, [records])

  const onTargetSelect = useCallback((target: Record<string, any>) => {
    setRecords(prev => prev.map(item => item.id == targetsOpen ? {...item, movie: target} : item))
    setTargetsOpen(null)
  }, [targetsOpen])

  const openTarget = useCallback((foreignId: string) => {
    window.open(`${app.public_url || app.url}${ApiEndpoints[app.type as AppType].targetPublicUri.uri}/${foreignId}`, '_blank')
  }, [app])

  const onManualImport = useCallback((item: Record<string, any>) => {
    setManualImportOpen(item)
  }, [])

  const onManualImportClick = useCallback((file: Record<string, any>) => {
    setManualImportOpen(null)
    manualImport(file)
  }, [manualImport])

  const onDelete = useCallback((e: any) => {
    e.preventDefault()
    e.stopPropagation()
    const itemId = e.target.dataset.itemid
    fetch(`/api/app/${app.id}/queue/${itemId}`, {method: 'DELETE'}).then(res => res.json())
      .then(data => {
        setRecords(prev => prev.filter(item => item.id.toString() !== itemId))
      })
  }, [app])

  if (loading) {
    return <div>Loading...</div>
  }

  if (records.length === 0) {
    return <Typography variant="h6" sx={{color: 'warning.main'}}>No records found</Typography>
  }

  return (
    <>
      <List>
        {records.map(item =>
          <Item key={item.id}
                item={item}
                downloads={downloads[item.downloadId] || []}
                onMerge={onMerge}
                onTargetChange={onTargetChange}
                openTarget={openTarget}
                onManualImport={onManualImport}
                onDelete={onDelete}
          />
        )}
      </List>
      {targetsOpen && <Targets app={app} onClose={() => setTargetsOpen(null)} onSelect={onTargetSelect} />}
      {manualImportOpen && <ManualImport app={app} onClose={() => setManualImportOpen(null)} item={manualImportOpen} onClickImport={onManualImportClick} />}
    </>
  )
}