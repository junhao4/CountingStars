import { Box, Input, Button } from "@mui/material";
import { loginWithEmail } from "./AuthController";
import { useMessageContext } from "../../contexts/MessageContext";
import { useState } from "react";
import { Link } from "react-router-dom";


export default function EmailLoginForm() {
    const { createMessage } = useMessageContext()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const onHandleLogin = async () => {
        await loginWithEmail({ email, password, createMessage })
    }

    return (
        <>
            <Box display='flex' gap='2rem' alignItems='center' margin='2rem 2rem 0 2rem'>
                <label htmlFor='login-email-input'>Email: </label>
                <Input id="login-email-input" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder='Email' autoComplete='email' />
            </Box>
            <Box display='flex' gap='2rem' alignItems='center' margin='2rem'>
                <label htmlFor='login-password-input'>Password:</label>
                <Input id="login-password-input" value={password} onChange={(e) => setPassword(e.target.value)} type='password'
                    placeholder='Password' autoComplete="new-password" sx={{ marginRight: '1.75rem' }} />

            </Box>
            <Button onClick={onHandleLogin} sx={{ justifySelf: 'center' }}>Login</Button>
            <Link to='/forgot' style={{
                color: 'grey', justifySelf: 'right', textAlign: 'right',
                padding: '1rem', margin: '0 0 0 auto'
            }} >Forgot Password?</Link>
        </>
    )
}