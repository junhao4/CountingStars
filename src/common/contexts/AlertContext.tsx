import { createContext, useContext, useState, type SetStateAction } from "react"

export type AlertType = "success"|"info"|"warning"|"error"
export type CreateAlertType = (arg0: AlertType, arg1: string) => void

interface AlertProps {
    variant: AlertType,
    text: string,
    trigger: boolean,
    setTrigger: React.Dispatch<SetStateAction<boolean>>,
    createAlert: (arg0: AlertType, arg1: string) => void,
}


export const AlertContext = 
    createContext<AlertProps>({
        variant: "success",
        text: "Welcome!",
        trigger: false,
        setTrigger: () => {},
        createAlert: () => {},
    })


export const MessageProvider = ({ children }: { children: React.ReactNode }) => {
  const [variant, setVariant] = useState<AlertType>("success")
  const [text, setText] = useState<string>("Welcome!")
  const [trigger, setTrigger] = useState<boolean>(false)

  const createAlert = (vari: AlertType, text: string) => {
    setText(text)
    setVariant(vari)
    setTrigger(true)
  }

  return (
    <AlertContext.Provider value={{ variant, text, trigger, setTrigger, createAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlertContext = () => useContext(AlertContext);
