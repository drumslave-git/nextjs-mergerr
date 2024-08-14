import ModalPopup from "@/components/common/ModalPopup"
import CircularProgress from "@mui/material/CircularProgress"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import Modal from "@mui/material/Modal"
import Paper from "@mui/material/Paper"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import {App} from "@prisma/client"
import {useEffect, useState} from "react"
import {FixedSizeList, ListChildComponentProps} from "react-window"

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
    <ModalPopup onClose={onClose} title="Targets">
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
    </ModalPopup>
  )
}

export default Targets