
import { useNavigate } from "react-router-dom"
import { useSessionContext } from "../../contexts/SessionContext"
import Loading from "../../general/Loading";
import { useMessageContext } from "../../contexts/MessageContext";

interface AuthWrapperProps {
    children: React.ReactNode
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
    const navigate = useNavigate()
    const { session, loading } = useSessionContext()
    const { createMessage } = useMessageContext()

    // Ensures users are logged in before rendering the page
    if (loading) {
        return (<Loading />)
    } else if (!session) {
        createMessage("failure", "Session does not exist or is expired! Please login again" )
        navigate('/login')
    } else {
        return (
        <>
            {children}
        </>
        )
    }
}