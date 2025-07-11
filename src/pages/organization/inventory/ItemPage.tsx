import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { usePageTitleContext } from "../../../common/contexts/PageTitleContext"
import Item from "../../../features/organization/item/components/Item"


export default function ItemPage() {
    const { itemId } = useParams()
    const { setTitle } = usePageTitleContext()

    useEffect(() => {
        setTitle("Item")
    })

    return (
        <Item ItemId={itemId}/>
    )
}