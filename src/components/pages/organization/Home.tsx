import { useEffect } from "react"
import { useOrgContext } from "../../contexts/OrgContext"
import { usePageTitleContext } from "../../contexts/PageTitleContext"
import { useNavigate } from "react-router-dom"
import Button from "@mui/material/Button"



export default function OrgHome() {
    const navigate = useNavigate()
    const { setTitle } = usePageTitleContext()
    const { getOrgContext } = useOrgContext(); const orgProps = getOrgContext()

    useEffect(() => {
        if (orgProps === null) navigate('/dashboard')
        setTitle(orgProps!.name)
    }, [])

    return (
        <>
            Welcome! This is the home page for your organization. {orgProps!.id}
            <Button onClick={() => navigate('users')}>Users</Button>
            <Button onClick={() => navigate('inventory')}>Inventory</Button>
        </>
    )
}