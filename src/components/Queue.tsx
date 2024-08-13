'use client'

import {MouseEvent} from "react"
import CircularProgress from "@mui/material/CircularProgress"
import Modal from "@mui/material/Modal"
import Collapse from "@mui/material/Collapse"
import Chip from "@mui/material/Chip"
import Button from "@mui/material/Button"
import ListItemButton from "@mui/material/ListItemButton"
import Paper from "@mui/material/Paper"
import TextField from "@mui/material/TextField"
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
import { FixedSizeList, ListChildComponentProps } from 'react-window'
import { useMergerr } from "@/components/MergerrProvider"
import {ApiEndpoints, AppType, MergeStatus} from "@/consts"

const TargetsStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  p: 4,
  width: '80dvw',
  minWidth: 500,
}

const filterRecord = (record: Record<string, any>) => {
  return record.trackedDownloadState === 'importPending' &&
    record.trackedDownloadStatus === 'warning' &&
    record.statusMessages.filter((msg: any) => !!msg.messages.find((message: any) => message === 'Unable to parse file')).length > 1
}

const Buttons = ({ item, onMerge, onTargetChange, onManualImport }: { item: Record<string, any>, onMerge: (e: any) => void, onTargetChange: (e: any) => void, onManualImport: (item: Record<string, any>, merge: any) => void }) => {
  const {merges} = useMergerr()

  const existingMerge = useMemo(() => {
    return merges.find((merge: any) => merge.output.search(item.movie.cleanTitle) !== -1)
  }, [merges, item])

  const onManualImportClick = useCallback((e: any) => {
    e.preventDefault()
    e.stopPropagation()
    onManualImport(item, existingMerge)
  }, [existingMerge, item, onManualImport])

  if (existingMerge) {
    return <Button variant="contained" color="secondary" onClick={onManualImportClick} disabled={existingMerge.status !== MergeStatus.done}>Import</Button>
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

const Item = ({ item, openTarget, downloads, onMerge, onTargetChange, onManualImport }: { item: Record<string, any>, openTarget: (id: string) => void, downloads: Record<string, any>[], onMerge: (e: any) => void, onTargetChange: (e: any) => void, onManualImport: (item: Record<string, any>, merge: any) => void }) => {
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
      <ListItemButton onClick={handleClick} href="" data-itemid={item.id} sx={{
        gap: 1,
      }}>
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
        {downloads.length > 0 && (
          <>
            <Buttons item={item} onMerge={onMerge} onTargetChange={onTargetChange} onManualImport={onManualImport} />
            <Chip label={`${downloads.length} files`} color="secondary" size="small" />
            <Button variant="contained" color="info" onClick={handleToggleDownloads}>
              {open ? <ExpandLess /> : <ExpandMore />}
            </Button>
          </>
        )}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
            {downloads.map((download: any) => (
              <ListItem key={download.id} sx={{ pl: 4 }}>
                <ListItemText primary={download.name} secondary={download.path} />
              </ListItem>
            ))}
        </List>
      </Collapse>
    </>
  )
}

const Targets = ({ app, onClose, onSelect }: { app: App, onClose: () => void, onSelect: (target: Record<string, any>) => void }) => {
  const [targets, setTargets] = useState<Record<string, any>[]>([])
  const [filteredTargets, setFilteredTargets] = useState<Record<string, any>[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [search, setSearch] = useState<string>('')

  useEffect(() => {
    fetch(`/api/app/${app.id}/targets`).then(res => res.json())
      .then(data => {
        setTargets(data)
        setFilteredTargets(data)
        setLoading(false)
      })
  }, [app])

  useEffect(() => {
    if (search.length < 3) {
      setFilteredTargets(targets)
    } else {
      setFilteredTargets(targets.filter(target => target.title.toLowerCase().includes(search.toLowerCase())))
    }
  }, [targets, search])

  return (
    <Modal
      open
      onClose={onClose}
    >
      <Paper sx={TargetsStyle}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Targets
        </Typography>
        {!loading && <TextField fullWidth label="Search" value={search} onChange={e => setSearch(e.target.value)} />}
        {loading && <CircularProgress />}
        <List>
          {/* @ts-ignore */}
          <FixedSizeList
            height={400}
            itemSize={50}
            itemCount={filteredTargets.length}
            overscanCount={5}
          >
            {({index, style}: ListChildComponentProps) => (
              <ListItem key={filteredTargets[index].id} style={style}>
                <ListItemButton onClick={() => onSelect(filteredTargets[index])}>
                  <ListItemText primary={`${filteredTargets[index].title} (${filteredTargets[index].year})`} secondary={filteredTargets[index].path} />
                </ListItemButton>
              </ListItem>
            )}
          </FixedSizeList>
        </List>
      </Paper>
    </Modal>
  )
}

export default function Queue({ app }: { app: App }) {
  const [records, setRecords] = useState<Record<string, any>[]>([])
  const [downloads, setDownloads] = useState<Record<string, Record<string, any>[]>>({})
  const [loading, setLoading] = useState<boolean>(true)
  const [targetsOpen, setTargetsOpen] = useState<null|number>(null)
  const {merge, listAppMerges} = useMergerr()

  useEffect(() => {
    fetch(`/api/app/${app.id}/queue`).then(res => res.json())
      .then(data => {
        const records = data.records.filter(filterRecord)
        setRecords(records)
        setLoading(false)
        return records
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
  }, [])

  const onManualImport = useCallback((item: Record<string, any>, merge: any) => {
    fetch(`/api/app/${app.id}/manualImport/${item.movieId}?output=${merge.output}`).then(res => res.json())
      .then(data => {
        console.log(data)
      })
  }, [records])

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
          />
        )}
      </List>
      {targetsOpen && <Targets app={app} onClose={() => setTargetsOpen(null)} onSelect={onTargetSelect} />}
    </>
  )
}