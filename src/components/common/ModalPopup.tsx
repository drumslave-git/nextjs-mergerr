import CloseIcon from "@mui/icons-material/Close"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Modal, {ModalProps} from "@mui/material/Modal"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
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


const ModalPopup = ({ children, title, onClose, ...rest }: { children: ReactNode, title?: string, onClose?: () => void } & Omit<ModalProps, 'open'>) => {
  return (
    <Modal
      onClose={onClose}
      {...rest}
      open={true}
    >
      <ModalPopupPaper>
        <Stack padding={2} direction="row" justifyContent="space-between" alignItems="center">
          {title && <Typography variant="h6" component="h2">{title}</Typography>}
          {onClose && (
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          )}
        </Stack>
        <Box>
          {children}
        </Box>
      </ModalPopupPaper>
    </Modal>
  )
}

export default ModalPopup