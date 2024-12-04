import Modal, {ModalProps} from "@mui/material/Modal"
import Paper from "@mui/material/Paper"
import styled from "@mui/material/styles/styled"
import Typography from "@mui/material/Typography"
import {ReactNode} from "react"

const ModalPopupPaper = styled(Paper)(({ theme }) => ({
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  p: 4,
  width: '80dvw',
  minWidth: 500,
  maxWidth: '95dvw',
  maxHeight: '95dvh',
  overflow: 'auto',
}))


const ModalPopup = ({ children, title, onClose, ...rest }: { children: ReactNode, title?: string, onClose: () => void } & Omit<ModalProps, 'open'>) => {
  return (
    <Modal
      onClose={onClose}
      {...rest}
      open={true}
    >
      <ModalPopupPaper>
        {title && <Typography variant="h6" component="h2">{title}</Typography>}
        {children}
      </ModalPopupPaper>
    </Modal>
  )
}

export default ModalPopup