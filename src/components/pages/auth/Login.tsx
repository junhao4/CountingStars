import { type FormEvent, use, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../../../helper/supabaseClient.ts';
import { usePageTitleContext } from '../../contexts/PageTitleContext.tsx';
import type { User } from '@supabase/supabase-js';
import { useSessionContext } from '../../contexts/SessionContext.tsx';
import Box from '@mui/material/Box';
import { Button, FormLabel, Input, Typography } from '@mui/material';
import { useMessageContext } from '../../contexts/MessageContext.tsx';


export function Login() {
    let navigate = useNavigate();
    const { session } = useSessionContext()
    const { setTitle } = usePageTitleContext()
    const { createMessage } = useMessageContext()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")


    const handleLogin = async () => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email, password
        });
        if (error) {
            createMessage('error', error.message);
            setPassword("")
            return;
        }
        if (data) {
            navigate('/dashboard')
        }
    }

    useEffect(() => {
        setTitle("Login");
    }, [])

    useEffect(() => {
        if (session) {
            navigate('/dashboard')
        }
    }, [session])

    return (
        <Box display='flex' flexDirection='column' justifySelf='center' alignItems='center' color='var(--foreground)'
            sx={{ outline: '2px solid black', borderRadius: '2px', margin: '2rem' }}>
            <Box display='flex' gap='2rem' alignItems='center' margin='2rem 2rem 0 2rem'>
                <Typography>Email: </Typography>
                <Input value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder='Email' />
            </Box>
            <Box display='flex' gap='2rem' alignItems='center' margin='2rem'>
                <Typography>Password: </Typography>
                <Input value={password} onChange={(e) => setPassword(e.target.value)} type='password'
                    placeholder='Password' sx={{ marginRight: '1.75rem' }} />
            </Box>
            <Button onClick={handleLogin} sx={{ justifySelf: 'center' }}>Login</Button>
            <Link to='/forgot' style={{
                color: 'grey', width: '90%', justifySelf: 'right', textAlign: 'right',
                padding: '1rem'
            }} >Forgot Password?</Link>
        </Box>
    )
}