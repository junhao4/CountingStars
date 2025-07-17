import { useLocation, useNavigate, useParams } from "react-router-dom"
import InventoryFolder, { type InventoryRow } from "../../../../features/organization/inventory/folder/components/InventoryFolder"
import { useEffect, useMemo, useState } from "react"
import { usePageTitleContext } from "../../../../common/contexts/PageTitleContext"
import InventoryBreadcrumbs from "../../../../features/organization/inventory/folder/components/InventoryBreadcrumbs"
import { Box } from "@mui/material"


export default function InventoryFolderPage() {
    const params = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const { setTitle } = usePageTitleContext()

    const folderId = useMemo(() => !params.folderId
        ? 0
        : params.folderId === 'root' ? 0 : parseInt(params.folderId), [params.folderId])

    if (isNaN(folderId)) { throw new Error() }

    const [data, setData] = useState<InventoryRow[]>([])

    useEffect(() => {
        setTitle('Inventory')
        if (location.pathname === '/dashboard/organization/inventory') {
            navigate('root')
        }
    }, [navigate])

    if (!params.folderId) {
        return (<></>) // ???
    }

    return (
        <Box sx={{ outline: '1px solid black', margin: '2rem', padding:'1rem',
            display:'flex', width: '60vw', flexDirection:'column', gap:'0.5rem'
         }}>
            <InventoryBreadcrumbs data={data} setData={setData} folderId={folderId} />
            <InventoryFolder data={data} setData={setData} folderId={folderId} />
        </Box>
    )
}