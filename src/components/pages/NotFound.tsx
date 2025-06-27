import Button from "@mui/material/Button"
import { useNavigate } from "react-router-dom"

function NotFound() {
    const navigate = useNavigate()
    return (
        <>
            <h1 className="head">Oops! This page does not exist.</h1>
            <Button onClick={() => navigate('/')}>Back to Home</Button>
        </>
    )
}

export default NotFound