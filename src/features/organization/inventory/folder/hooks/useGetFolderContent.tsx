import { useEffect, useState } from "react"
import { fetchItems, fetchFolders } from "../api/FolderApi"
import type { ItemFolder, ItemWithCategories } from "../../../../../helper/types"
import { useOrgContext, type ValidOrg } from "../../../../../common/contexts/OrgContext"


export default function useGetFolderContent({folderId}: {folderId: number | null}) {
    const { org } = useOrgContext() as ValidOrg

    const [items, setItems] = useState<ItemWithCategories[]>([])
    const [folders, setFolders] = useState<ItemFolder[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        const promiseFiles = fetchItems(org.id, folderId)
            .then(data => setItems(data))
        const promiseFolders = fetchFolders(org.id, folderId)
            .then(data => setFolders(data))
        Promise.all([promiseFiles, promiseFolders]).then(() => setLoading(false))
    }, [folderId])

    return { loading, items, folders } 
}