import type { GridRenderCellParams } from "@mui/x-data-grid/models/params"
import type { CategoryFetch, ItemFetch } from "../api/InventoryApi"
import Button from "@mui/material/Button"

// Manages the action buttons for the 'categories' column
interface CategoryChipProps {
    params: GridRenderCellParams<ItemFetch>,
}

export default function CategoryChip({ params }: CategoryChipProps) {
    const buttonStyle = { borderRadius: '16px', color: 'black', backgroundColor: '#eeeeee' }

    return (
        <div style={{ display: 'flex', alignItems: 'center', textAlign: 'center', flexWrap: 'wrap' }}>
            {
                (params.row.categories || []).map((cat: CategoryFetch) => {
                    return (
                        <Button key={cat.id} sx={{ ...buttonStyle }}>
                            {cat.name}
                        </Button>)
                })
            }
        </div>
    )
}