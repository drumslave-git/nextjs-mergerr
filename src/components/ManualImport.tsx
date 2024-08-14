import ModalPopup from "@/components/common/ModalPopup"
import {useMergerr} from "@/components/MergerrProvider"
import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material"
import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import CircularProgress from "@mui/material/CircularProgress"
import { App } from "@prisma/client"
import {useEffect, useMemo, useState} from "react"

const ManualImport = ({app, onClose, item, onClickImport}: { app: App, onClose: () => void, item: Record<string, any>, onClickImport: (file: Record<string, any>) => void }) => {
  const {findMergeByCleanTitle} = useMergerr()
  const [files, setFiles] = useState<Record<string, any>[]>([])
  const [target, setTarget] = useState<Record<string, any> | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const merge = useMemo(() => {
    return findMergeByCleanTitle(item.movie.cleanTitle)
  }, [item, findMergeByCleanTitle])

  useEffect(() => {
    if (!merge) {
      return
    }
    setLoading(true)
    fetch(`/api/app/${app.id}/manualImport/${item.movieId}?output=${merge.output}`).then(res => res.json())
      .then(data => {
        setFiles(data)
        setLoading(false)
      })
    fetch(`/api/app/${app.id}/targets/${item.movieId}`).then(res => res.json())
      .then(data => {
        setTarget(data)
      })
  }, [app, item, merge])

  const movieFilePath = useMemo(() => {
    return target?.movieFile?.path
  }, [target])

  return (
    <ModalPopup title="Manual Import" onClose={onClose}>
      {loading && <CircularProgress />}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Path</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {files.map(file => (
            <TableRow key={file.id}>
              <TableCell>{file.name}</TableCell>
              <TableCell>{file.path}</TableCell>
              <TableCell>
                {movieFilePath === file.path ? <Chip label="Imported" color="success" size="small" /> : (
                  <Button variant="contained" color="secondary" onClick={() => onClickImport(file)}>Import</Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ModalPopup>
  )
}

export default ManualImport