import { Box, Stack } from "@mui/material"
import Loading from "../../../../common/components/Loading"
import useGetItem from "../hooks/useGetItem"


export default function Item({ ItemId }: { ItemId: string | undefined }) {
    const { loading, item } = useGetItem(ItemId)



    if (loading) return (<Loading />)
    if (!item) return (<Box>NO ITEM FOUND!</Box>)

    return (
        <Box>
            <Stack>
                <div>Name: {item.name}</div>
                <div>...</div>
            </Stack>
        </Box>
    )
}