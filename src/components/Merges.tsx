'use client'

import {useMergerr} from "@/components/MergerrProvider"
import {MergeStatus} from "@/consts"
import IconButton from "@mui/material/IconButton"
import DeleteIcon from "@mui/icons-material/Delete"
import Chip from "@mui/material/Chip"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"

const statusColors = {
  [MergeStatus.created]: 'secondary',
  [MergeStatus.running]: 'primary',
  [MergeStatus.done]: 'success',
  [MergeStatus.failed]: 'error',
}

export default function Merges() {
  const {merges, listAppMerges, deleteMerge} = useMergerr()

  return <Paper sx={{p: 2}}>
    <List>
      {merges.map(merge => <ListItem key={merge.id}>
        <ListItemText primary={merge.output} secondary={<Typography variant="body2" color={statusColors[merge.status as MergeStatus] as any}>
          {merge.result || merge.error || merge.progress + '%'}
        </Typography>} />
        <Chip color={statusColors[merge.status as MergeStatus] as any} label={merge.status} />
        <IconButton onClick={() => deleteMerge(merge)} color="error">
          <DeleteIcon />
        </IconButton>
      </ListItem>)}
    </List>
  </Paper>
}