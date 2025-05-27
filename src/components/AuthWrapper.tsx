
import { Navigate, useNavigate } from "react-router-dom"
import { useSession } from "./contexts/SessionContext"

interface AuthWrapperProps {
    children: React.ReactNode
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
    const navigate = useNavigate()
    const { session, loading } = useSession();

    //ensures users are logged in before rendering the page
    if (loading) {
        console.log(1)
        return (<p>Loading...</p>)
    } else if (!session) {
        console.log(2)
        alert("Session does not exist or is expired! Please login again")
        return (<Navigate to='/login' />)
    } else {
        return (
        <>
            {children}
        </>
        )
    }
}