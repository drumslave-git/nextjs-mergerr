import Modal from "@mui/material/Modal"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import {ReactNode} from "react"

const ModalPopupStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  p: 4,
  width: '80dvw',
  minWidth: 500,
}

const ModalPopup = ({ children, title, onClose }: { children: ReactNode, title: string, onClose: () => void }) => {
  return (
    <Modal
      onClose={onClose}
      open={true}
    >
      <Paper sx={ModalPopupStyle}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {title}
        </Typography>
        {children}
      </Paper>
    </Modal>
  )
}

export default ModalPopup