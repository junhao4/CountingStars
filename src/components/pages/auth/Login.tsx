import { useEffect } from 'react';
import { usePageTitleContext } from '../../contexts/PageTitleContext.tsx';
import EmailLoginForm from './EmailLoginForm.tsx';
import { useSessionContext } from '../../contexts/SessionContext.tsx';
import { useNavigate } from 'react-router-dom';


export function Login() {
    const { setTitle } = usePageTitleContext()
    const { user } = useSessionContext()
    const navigate = useNavigate()

    useEffect(() => {
        setTitle("Login");

        if (user) {
            navigate('/dashboard')
        }
    }, [])

    return (
        <EmailLoginForm />
    )
}