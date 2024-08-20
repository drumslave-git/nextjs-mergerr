'use client'

import Alert from "@mui/material/Alert"
import Snackbar from "@mui/material/Snackbar"
import {ReactNode, createContext, useCallback, useContext, useState} from "react"

export type Notification = {
  title: string,
  message: string,
  type: 'success' | 'error' | 'info' | 'warning',
  action?: ReactNode
}

const NotificationsContext = createContext<{
  notifications: Notification[],
  addNotification: (notification: any) => void,
  removeNotification: (notification: any) => void,
}>({
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {},
})

export function NotificationsProvider({children}: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback((notification: Notification) => {
    setNotifications(prev => [...prev, notification])
  }, [])

  const removeNotification = useCallback((notification: Notification) => {
    setNotifications(prev => prev.filter(n => n !== notification))
  }, [])

  return (
    <NotificationsContext.Provider value={{notifications, addNotification, removeNotification}}>
      {children}
      {notifications.map((notification, idx) => (
        <Snackbar
          key={idx}
          open
          autoHideDuration={6000}
          onClose={() => removeNotification(notification)}
        >
          <Alert
            onClose={() => removeNotification(notification)}
            severity={notification.type}
            variant="filled"
            sx={{ width: '100%' }}
            action={notification.action}
          >
            <strong>{notification.title}</strong>
            &nbsp;
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  return useContext(NotificationsContext)
}