import { useEffect, useState } from "react"
import type { ItemWithCategories } from "../../../../helper/types"
import { fetchItem } from "../api/ItemApi"
import { useOrgContext, type ValidOrg } from "../../../../common/contexts/OrgContext"

export default function useGetItem(ItemId: string | undefined) {
    console.log("useGetItem Running!")
    const { org } = useOrgContext() as ValidOrg

    const [loading, setLoading] = useState(true)
    const [item, setItem] = useState<ItemWithCategories | null>(null)

    useEffect(() => {
        if (ItemId && !isNaN(parseInt(ItemId))) {
            fetchItem(org.id, parseInt(ItemId)).then((item) => {
                setItem(item)
                setLoading(false)
            })
        } else {
            setLoading(false)
        }
    }, [])

    return { loading, item }
}