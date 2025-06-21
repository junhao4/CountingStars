import { Button } from "@mui/material"
import { useMessageContext } from "../contexts/MessageContext"
import { useEffect, useRef, useState } from "react"
import { CSSTransition } from "react-transition-group"
import "./Message.css"

export default function Message() {
    const { variant, text, trigger, setTrigger } = useMessageContext()

    const success: React.CSSProperties = {
        color: 'black',
        backgroundColor: '#a0ff00',
    }
    const failure: React.CSSProperties = {
        color: 'black',
        backgroundColor: '#ff765e',
    }
    const style = variant === "success" ? success : failure

    const nodeRef = useRef(null)

    const [timeouts, setTimeouts] = useState<NodeJS.Timeout|null>(null)
    useEffect(() => {
        if (trigger) {
            setTimeouts(setTimeout(() => {
                setTrigger(false)
            }, 3000))
        } else if (timeouts) {
            clearTimeout(timeouts)
        }
        console.log(timeouts)
    }, [trigger])

    return (
        <div>
            <Button onClick={() => setTrigger(prev => !prev)}>Click</Button>
            <CSSTransition
                in={trigger}
                nodeRef={nodeRef}
                timeout={500}
                classNames="message-box"
                unmountOnExit>
                <div className="message-box" style={style} ref={nodeRef}>
                    <Button className="message-box-button" onClick={() => setTrigger(false)}>X</Button >
                    {text}
                </div >
            </CSSTransition>
        </div>
    )
}