import { createContext, useContext, useState, type SetStateAction } from "react"

interface MessageProps {
    variant: "success" | "failure",
    text: string,
    trigger: boolean,
    setTrigger: React.Dispatch<SetStateAction<boolean>>,
    createMessage: (arg0: "success" | "failure", arg1: string) => void,
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
  const [variant, setVariant] = useState<"success"|"failure">("success")
  const [text, setText] = useState<string>("Welcome!")
  const [trigger, setTrigger] = useState<boolean>(false)

  const createMessage = (variant: "success" | "failure", text: string) => {
    setText(text)
    setVariant(variant)
    setTrigger(true)
  }

  return (
    <MessageContext.Provider value={{ variant, text, trigger, setTrigger, createMessage }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessageContext = () => useContext(MessageContext);
