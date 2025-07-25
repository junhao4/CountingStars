import { useEffect, useState } from "react"
import { fetchItemList } from "./itemSelectApi"
import { useOrgContext, type ValidOrg } from "../../../../common/contexts/OrgContext"
import { handleGenerateAlert } from "../../../../common/functions/ErrorAlerts"
import { useAlertContext } from "../../../../common/contexts/AlertContext"
import type { Item } from "../../../../helper/types"


export default function useItemSelect() {
    const { org } = useOrgContext() as ValidOrg
    const { createAlert } = useAlertContext()

    const [loading, setLoading] = useState(true)
    const [itemList, setItemList] = useState<Item[]>([])

    useEffect(() => {
        fetchItemList(org.id)
            .then(data => data === 'itemError' 
                ? handleGenerateAlert(data, createAlert) 
                : (setItemList(data)))
            .then(() => setLoading(false))
    }, [])


    return { itemList, loading }
}