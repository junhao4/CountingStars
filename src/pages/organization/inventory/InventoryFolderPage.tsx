import { useLocation, useNavigate, useParams } from "react-router-dom"
import InventoryFolder from "../../../features/organization/inventory/folder/components/InventoryFolder"
import { useEffect } from "react"
import { usePageTitleContext } from "../../../common/contexts/PageTitleContext"
import InventoryBreadcrumbs from "../../../features/organization/inventory/folder/components/InventoryBreadcrumbs"
import useGetFolderContent from "../../../features/organization/inventory/folder/hooks/useGetFolderContent"
import Loading from "../../../common/components/Loading"
import "../../../features/organization/inventory/folder/components/InventoryFolder.css"

const FOLDER_ROOT_PATH = 'root' // id === 0

const validateFolderId = (folderId: string) => {
    if (folderId === FOLDER_ROOT_PATH) {
        return FOLDER_ROOT_PATH
    }
    const id = parseInt(folderId)
    if (isNaN(id)) {
        return null
    }
    return id
}

export default function InventoryPage() {
    const params = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const { setTitle } = usePageTitleContext()

    var folderId: number | null | 'root' = 'root'
    if (params.folderId) {
        folderId = validateFolderId(params.folderId)
    }

    const { loading, data, setData } = useGetFolderContent({ folderId })

    useEffect(() => {
        setTitle('Inventory')
        if (location.pathname === '/dashboard/organization/inventory') {
            navigate('root')
        }
    }, [navigate])

    if (loading) {
        return (<Loading />)
    } else if (folderId === null) {
        return (<p>INVALID FOLDER ID</p>)
    }

    return (
        <div className="inventory-container">
            <InventoryBreadcrumbs data={data} setData={setData} folderId={folderId} />
            <InventoryFolder data={data} setData={setData} folderId={folderId} />
        </div>
    )
}