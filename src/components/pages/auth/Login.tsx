import { useEffect } from 'react';
import { usePageTitleContext } from '../../contexts/PageTitleContext.tsx';
import Box from '@mui/material/Box';
import EmailLoginForm from './EmailLoginForm.tsx';


export function Login() {
    const { setTitle } = usePageTitleContext()

    useEffect(() => {
        setTitle("Login");
    }, [])

    return (
        <Box display='flex' flexDirection='column' justifySelf='center' alignItems='center' color='var(--foreground-text)'
            sx={{ outline: '2px solid black', borderRadius: '2px', margin: '2rem' }}>
            <EmailLoginForm />
        </Box>
    )
}