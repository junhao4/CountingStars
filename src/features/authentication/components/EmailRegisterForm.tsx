import { Box, Button, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { useAlertContext } from "../../../common/contexts/AlertContext";
import { registerWithEmail } from "../api/AuthApi";

export default function EmailRegisterForm() {
    const { createAlert } = useAlertContext()
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = () => registerWithEmail({ email, password, createAlert })

    return (
        <form>
            <Stack sx={{
                backgroundColor: 'var(--foreground)', margin: '2rem 0', outline: '2px solid var(--border)',
                alignItems: 'center', borderRadius:'1rem'
            }}>
                <Box display='flex' gap='2rem' alignItems='center' margin='2rem 2rem 0 2rem'>
                    <label>Email: </label>
                    <TextField value={email} label="Email" onChange={(e) => setEmail(e.target.value)}
                        placeholder='Email' autoComplete="email" />
                </Box>
                <Box display='flex' gap='2rem' alignItems='center' margin='2rem'>
                    <label>Password: </label>
                    <TextField value={password} label="Password" onChange={(e) => setPassword(e.target.value)} type='password'
                        placeholder='Password' autoComplete="new-password" sx={{ marginRight: '1.75rem' }} />
                </Box>
                <Button onClick={handleRegister} sx={{ justifySelf: 'center', marginBottom: '3.5rem' }}>Register</Button>
            </Stack>
        </form>
    )
}