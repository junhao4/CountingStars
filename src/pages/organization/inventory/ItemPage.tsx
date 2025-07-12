import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { usePageTitleContext } from "../../../common/contexts/PageTitleContext"
import Item from "../../../features/organization/item/components/Item"
import ItemLogs from "../../../features/organization/item/components/ItemLogs"


export default function ItemPage() {
    const { itemId } = useParams()
    const { setTitle } = usePageTitleContext()

    useEffect(() => {
        setTitle("Item")
    })

    if(!itemId || isNaN(parseInt(itemId))) {
        return <div>INVALID ITEM ID</div>
    }

     const itemIdNumber = parseInt(itemId!)

    return (
        <div>
            <Item itemId={itemIdNumber} />
            <ItemLogs itemId={itemIdNumber} />
        </div>
    )
}