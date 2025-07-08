import Button from "@mui/material/Button"
import { useNavigate } from "react-router-dom"

export default function NotFoundPage() {
    const navigate = useNavigate()
    return (
        <>
            <h1 className="head">Oops! This page does not exist.</h1>
            <Button size='large' onClick={() => navigate('/')}>Back to Home</Button>
        </>
    )
}