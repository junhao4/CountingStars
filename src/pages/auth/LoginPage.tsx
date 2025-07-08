import { useEffect } from 'react';
import { usePageTitleContext } from '../../common/contexts/PageTitleContext.tsx';
import EmailLoginForm from '../../features/authentication/components/EmailLoginForm.tsx';
import { useSessionContext } from '../../common/contexts/SessionContext.tsx';
import { useNavigate } from 'react-router-dom';


export default function LoginPage() {
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