import { Box, Typography, Input, Button, Stack } from "@mui/material";
import { useState } from "react";
import { registerWithEmail } from "./AuthController";
import { useMessageContext } from "../../contexts/MessageContext";


export default function EmailRegisterForm() {
    const { createMessage } = useMessageContext()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = () => registerWithEmail({ email, password, createMessage })

    return (
        <form>
            <Stack sx={{
                backgroundColor: 'var(--foreground)', margin: '2rem 0', outline: '2px solid black',
                alignItems: 'center'
            }}>
                <Box display='flex' gap='2rem' alignItems='center' margin='2rem 2rem 0 2rem'>
                    <Typography>Email: </Typography>
                    <Input value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder='Email' autoComplete="email" />
                </Box>
                <Box display='flex' gap='2rem' alignItems='center' margin='2rem'>
                    <Typography>Password: </Typography>
                    <Input value={password} onChange={(e) => setPassword(e.target.value)} type='password'
                        placeholder='Password' autoComplete="new-password" sx={{ marginRight: '1.75rem' }} />
                </Box>
                <Button onClick={handleRegister} sx={{ justifySelf: 'center', marginBottom: '3.5rem' }}>Register</Button>
            </Stack>
        </form>
    )
}