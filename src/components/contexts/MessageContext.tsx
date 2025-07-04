import { createContext, useContext, useState, type SetStateAction } from "react"

export type VariantType = "success"|"info"|"warning"|"error"

interface MessageProps {
    variant: VariantType,
    text: string,
    trigger: boolean,
    setTrigger: React.Dispatch<SetStateAction<boolean>>,
    createMessage: (arg0: VariantType, arg1: string) => void,
}


export const MessageContext = 
    createContext<MessageProps>({
        variant: "success",
        text: "Welcome!",
        trigger: false,
        setTrigger: () => {},
        createMessage: () => {},
    })


export const MessageProvider = ({ children }: { children: React.ReactNode }) => {
  const [variant, setVariant] = useState<VariantType>("success")
  const [text, setText] = useState<string>("Welcome!")
  const [trigger, setTrigger] = useState<boolean>(false)

  const createMessage = (vari: VariantType, text: string) => {
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
