import type { Category } from "../../../../../helper/types"
import { Chip } from "@mui/material"

// Manages the action buttons for the 'categories' column
interface CategoryChipsProps {
    params: Category[]
}

export default function CategoryChips({ params }: CategoryChipsProps) {
    const chipStyle = { borderRadius: '16px' }

    return (
        <div style={{ display: 'flex', alignItems: 'center', textAlign: 'center', flexWrap: 'wrap' }}>
            {
                (params.map(cat => {
                    return (
                        <Chip key={cat.id} sx={{ ...chipStyle }} label={cat.name}/>
                )}))
            }
        </div>
    )
}