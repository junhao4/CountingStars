import { Box, Button, Stack, TextField } from "@mui/material";
import { loginWithEmail } from "../api/AuthApi";
import { useAlertContext } from "../../../common/contexts/AlertContext";
import { useState } from "react";
import { Link } from "react-router-dom";


export default function EmailLoginForm() {
    const { createAlert } = useAlertContext()
    
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = async () => {
        await loginWithEmail({ email, password, createAlert })
    }

    return (
        <Stack sx={{backgroundColor: 'var(--foreground)', margin:'2rem 0', outline:'2px solid black',
            alignItems:'center'
        }}>
            <Box display='flex' gap='2rem' alignItems='center' margin='2rem 2rem 0 2rem'>
                <label htmlFor='login-email-input'>Email: </label>

                     <TextField
          id="login-email-input"
          label="Email"
          type="text"
          autoComplete="on"
          variant="standard"
          color="secondary"
          onChange={(e) => setEmail(e.target.value)}

        />
            </Box>

            <Box display='flex' gap='2rem' alignItems='center' margin='2rem'>
                <label htmlFor='login-password-input'>Password:</label>
               
                    <TextField
          id="login-password-input"
          label="Password"
          type="password"
          autoComplete="new-password"
          variant="standard"
          color="secondary"
          onChange={(e) => setPassword(e.target.value)}
          sx={{ marginRight: '1.75rem' }}
        />
            </Box>

            <Button onClick={handleLogin} sx={{ justifySelf: 'center',color: 'var(--secondary)', borderColor: 'var(--secondary)'}}>Login</Button>

            <Link to='/forgot' style={{
                color: 'grey', justifySelf: 'right', textAlign: 'right',
                padding: '1rem', margin: '0 0 0 auto'
            }} >Forgot Password?</Link>
        </Stack>
    )
}