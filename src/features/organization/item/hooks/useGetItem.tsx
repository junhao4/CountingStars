import { useEffect, useState } from "react"
import type { ItemWithCategories } from "../../../../helper/types"
import { fetchItem } from "../api/ItemApi"
import { useOrgContext, type ValidOrg } from "../../../../common/contexts/OrgContext"

export default function useGetItem(itemId: number) {
    const { org } = useOrgContext() as ValidOrg

    const [loading, setLoading] = useState(true)
    const [item, setItem] = useState<ItemWithCategories | null>(null)

    useEffect(() => {
        console.log('useGetItem running fetch!')
        fetchItem(org.id, itemId).then((item) => {
            setItem(item)
            setLoading(false)
        })
    }, [])

return { loading, item, setItem }
}