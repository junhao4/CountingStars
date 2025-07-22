import { createContext, useContext, useState, type SetStateAction } from "react"

export type AlertType = "success" | "info" | "warning" | "error"
export type CreateAlertType = (arg0: AlertType, arg1: string) => void

interface AlertProps {
  alert: Alert[],
  setAlert: React.Dispatch<SetStateAction<Alert[]>>
  createAlert: (arg0: AlertType, arg1: string) => void,
}


export const AlertContext =
  createContext<AlertProps>({
    alert: [],
    setAlert: () => { },
    createAlert: () => { },
  })

export type Alert = {
  variant: AlertType,
  text: string,
  trigger: boolean,
  key: number
}

export const handleCloseAlert = (setAlert: React.Dispatch<SetStateAction<Alert[]>> ,{ key } : { key: number }) => {
    setAlert(prev => {
      const index = prev.findIndex(a => a.key === key)
      if (index === -1) {
        return prev 
      }
      prev[index].trigger = false
      setTimeout(() => {
        setAlert(prev => {
          return prev.filter((p) => p.key !== key)
        })
      }, 1000)
      return [...prev]
    })
  }

export const MessageProvider = ({ children }: { children: React.ReactNode }) => {
  const [key, setKey] = useState(0)
  const [alert, setAlert] = useState<Alert[]>([])

  const createAlert = (vari: AlertType, text: string) => {
    setAlert(prev => [...prev.filter(a => a.key !== key), { variant: vari, text, trigger: true, key }])
    setKey(prev => prev + 1)
    setTimeout(() => {
      handleCloseAlert(setAlert, { key })
    }, 2000)
  }

  return (
    <AlertContext.Provider value={{ alert, setAlert, createAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlertContext = () => useContext(AlertContext);
