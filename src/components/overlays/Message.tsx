import { Alert, AlertTitle, Box, Button, Grow } from "@mui/material"
import { useMessageContext } from "../contexts/MessageContext"

export default function Message() {
    const { variant, text, trigger, setTrigger } = useMessageContext()

    return (
        <div style={{position:'fixed', width:'80vw', transform:'translateX(10%)', zIndex:'1'}} hidden={!trigger}>
            <Button onClick={() => setTrigger(prev => !prev)}>Click Me</Button>
            <Grow in={trigger}
                style={{ transformOrigin: '0 0 0' }}
                {...(trigger ? { timeout: 1000 } : {})}>
                <Alert severity={variant} variant='filled' color={variant}>
                    <AlertTitle>{variant.charAt(0).toUpperCase() + variant.slice(1)}</AlertTitle>
                    {text}
                </Alert>
            </Grow>
        </div>
    )
}