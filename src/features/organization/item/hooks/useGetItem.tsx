import { useEffect, useState } from "react"
import type { ItemWithCategories } from "../../../../helper/types"
import { addItemCategory, deleteItemCategory, fetchItem, updateItem } from "../api/ItemApi"
import { useAlertContext } from "../../../../common/contexts/AlertContext"
import { useSessionContext, type ValidSession } from "../../../../common/contexts/SessionContext"
import { useOrgContext, type ValidOrg } from "../../../../common/contexts/OrgContext"
import { addLog } from "../../log/api/LogApi"

export default function useGetItem(itemId: number) {
    const { createAlert } = useAlertContext()
    const { user } = useSessionContext() as ValidSession
    const { org } = useOrgContext() as ValidOrg

    const [loading, setLoading] = useState(true)
    const [item, setItem] = useState<ItemWithCategories | null>(null)

    useEffect(() => {
        console.log('useGetItem running fetch!')
        fetchItem(itemId).then((item) => {
            setItem(item)
            setLoading(false)
        })
    }, [])

    const handleSetItem = async (newItem: ItemWithCategories) => {
        // Shallow comparison of item equality
        if (item === newItem) {
            return
        }
        if (item?.quantity != newItem.quantity) {
            addLog(org.id, "updateQuantity", user.id, newItem.id , {newQuantity: newItem.quantity, oldQuantity: item?.quantity!})
        }

        const newCats = newItem.categories.filter(cat => !item?.categories.map(cat => cat.id).includes(cat.id))
        const oldCats = item!.categories.filter(cat => !newItem.categories.map(cat => cat.id).includes(cat.id))

        const addSuccess = await Promise.all(newCats.map(async cat => {
            return await addItemCategory(user.id, org.id, item!.id, item!.name, cat.id, cat.name)
        })).then(res => res.reduce((prev, next) => prev && next, true))

        const deleteSuccess = await Promise.all(oldCats.map(async cat => {
            return await deleteItemCategory(user.id, org.id, item!.id, item!.name, cat.id, cat.name)
        })).then(res => res.reduce((prev, next) => prev && next, true))

        const itemSuccess = await updateItem(newItem)

        if (addSuccess && deleteSuccess && itemSuccess) {
            createAlert('success', "Successfully updated new item!")
            setItem({...newItem, lastModified: new Date(Date.now()).toISOString()})
        } else {
            createAlert('error', "Something went wrong!")
        }
    }
    
    return { loading, item, handleSetItem }
}