
import { useNavigate } from "react-router-dom"
import { useSession } from "./contexts/SessionContext"

interface AuthWrapperProps {
    children: React.ReactNode
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
    const navigate = useNavigate()
    const { session, loading } = useSession();

    // Ensures users are logged in before rendering the page
    if (loading) {
        return (<p>Loading...</p>)
    } else if (!session) {
        alert("Session does not exist or is expired! Please login again")
        navigate('/login')
    } else {
        return (
        <>
            {children}
        </>
        )
    }
}