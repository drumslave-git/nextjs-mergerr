//@ts-nocheck TODO this is deprecated
'use client'

import LinearProgressWithLabel from "@/components/LinearProgressWithLabel"
import {useMergerr} from "@/components/MergerrProvider"
import {MergeStatus} from "@/consts"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import DeleteIcon from "@mui/icons-material/Delete"
import Chip from "@mui/material/Chip"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import {Merge} from "@prisma/client"
import {useCallback, useState} from "react"

const statusColors = {
  [MergeStatus.created]: 'secondary',
  [MergeStatus.running]: 'primary',
  [MergeStatus.done]: 'success',
  [MergeStatus.failed]: 'error',
}

export default function Merges() {
  const {merges, listAppMerges, deleteMerge} = useMergerr()
  const [deleteDisabled, setDeleteDisabled] = useState<boolean>(false)

  const onDelete = useCallback((merge: Merge) => {
    setDeleteDisabled(true)
    deleteMerge(merge).then(() => {
      listAppMerges()
      setDeleteDisabled(false)
    })
  }, [deleteMerge, listAppMerges])

  return <Paper sx={{p: 2}}>
    <List>
      {merges.map(merge => <ListItem key={merge.id}>
        <ListItemText
          primary={merge.output}
          secondary={<Typography variant="body2" component="div" color={statusColors[merge.status as MergeStatus] as any}>
          {merge.result || merge.error || <Box sx={{maxWidth: '70%'}}><LinearProgressWithLabel value={merge.progress} /></Box>}
        </Typography>} />
        <Chip color={statusColors[merge.status as MergeStatus] as any} label={merge.status} />
        <IconButton onClick={() => onDelete(merge)} color="error" disabled={deleteDisabled}>
          <DeleteIcon />
        </IconButton>
      </ListItem>)}
    </List>
  </Paper>
}