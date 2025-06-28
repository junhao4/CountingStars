import { createContext, useContext, useState, type SetStateAction } from "react"

type variantType = "success"|"info"|"warning"|"error"

interface MessageProps {
    variant: variantType,
    text: string,
    trigger: boolean,
    setTrigger: React.Dispatch<SetStateAction<boolean>>,
    createMessage: (arg0: variantType, arg1: string) => void,
}


export const MessageContext = 
    createContext<MessageProps>({
        variant: "success",
        text: "Welcome!",
        trigger: false,
        setTrigger: (arg0) => {},
        createMessage: (arg0, arg1) => {},
    })


export const MessageProvider = ({ children }: { children: React.ReactNode }) => {
  const [variant, setVariant] = useState<variantType>("success")
  const [text, setText] = useState<string>("Welcome!")
  const [trigger, setTrigger] = useState<boolean>(false)

  const createMessage = (vari: variantType, text: string) => {
    setText(text)
    setVariant(vari)
    setTrigger(true)
  }

  return (
    <MessageContext.Provider value={{ variant, text, trigger, setTrigger, createMessage }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessageContext = () => useContext(MessageContext);
