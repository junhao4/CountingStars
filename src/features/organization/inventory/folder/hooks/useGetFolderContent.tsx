import { useEffect, useState } from "react"
import { fetchItems, fetchFolders } from "../api/FolderApi"
import type { ItemFolder, ItemWithCategories } from "../../../../../helper/types"
import { useOrgContext, type ValidOrg } from "../../../../../common/contexts/OrgContext"

export type InventoryRow =
    | ItemWithCategories & { type: 'item' }
    | ItemFolder & { type: 'folder' }

export default function useGetFolderContent({ folderId }: { folderId: number | 'root' | null }) {
    const { org } = useOrgContext() as ValidOrg

    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<InventoryRow[]>([])

    useEffect(() => {
        if (folderId === null) {
            setLoading(false)
            return
        }
        const promiseFiles = fetchItems(org.id, folderId === 'root' ? null : folderId)
        const promiseFolders = fetchFolders(org.id, folderId === 'root' ? null : folderId)

        Promise.all([promiseFiles, promiseFolders])
            .then(res => setData([
                ...res[0].map(file => ({...file, type:'item'})) as InventoryRow[],
                ...res[1].map(folder => ({...folder, type:'folder'})) as InventoryRow[]]))
            .then(() => setLoading(false))
    }, [folderId])

    return { loading, data, setData }
}