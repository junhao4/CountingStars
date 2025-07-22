import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { usePageTitleContext } from "../../../common/contexts/PageTitleContext"
import Item from "../../../features/organization/item/components/Item"
import _ItemLogs from "../../../features/organization/item/components/ItemLogs"


export default function ItemPage() {
    const { itemId } = useParams()
    const navigate = useNavigate()
    const { setTitle } = usePageTitleContext()

    useEffect(() => {
        if (!itemId) {
            navigate('../root', {relative:'path'})
        }
        setTitle("Item")
    }, [navigate])

    if(!itemId || isNaN(parseInt(itemId))) {
        return <div>INVALID ITEM ID</div>
    }

    const itemIdNumber = parseInt(itemId!)

    return (
        <div>
            <Item itemId={itemIdNumber} />
            {/* <_ItemLogs itemId={itemIdNumber} /> */}
        </div>
    )
}