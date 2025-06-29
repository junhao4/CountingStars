import { useEffect } from "react"
import { useOrgContext } from "../../contexts/OrgContext"
import { usePageTitleContext } from "../../contexts/PageTitleContext"
import { useNavigate } from "react-router-dom"
import Button from "@mui/material/Button"
import Sidebar from "../../overlays/Sidebar"


export default function OrgHome() {
    const navigate = useNavigate()
    const { setTitle } = usePageTitleContext()
    const { getOrgContext } = useOrgContext(); const orgProps = getOrgContext()

    useEffect(() => {
        if (orgProps === null) navigate('/dashboard')
        setTitle(orgProps!.name)
    }, [])


    return (
        <div>
            Welcome! This is the home page for your organization. {orgProps!.id}

        </div>
    )
}