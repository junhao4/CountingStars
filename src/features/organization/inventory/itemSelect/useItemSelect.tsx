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

    const [filteredList, setFilteredList] = useState<Item[]>([])

    useEffect(() => {
        fetchItemList(org.id)
            .then(data => data === 'itemError' 
                ? handleGenerateAlert(data, createAlert) 
                : (setItemList(data),setFilteredList(data)))
            .then(() => setLoading(false))
    }, [])

    const handleFilter = (text: string) => {
        if (text === "") {
            setFilteredList(itemList)
        } else {
            setFilteredList(itemList.filter(item => (item.name + ' ' + item.id.toString()).includes(text)))
        }
    }


    return { filteredList, handleFilter, loading }
}