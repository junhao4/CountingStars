import { useEffect, useState } from "react";
import type { InventoryRow } from "./useGetFolderContent";


export default function useFilterModel(data: InventoryRow[]) {
    const [selectedCategories, setSelectedCategories] = useState<number[]>([])
    const [filteredData, setFilteredData] = useState<InventoryRow[]>(data)

    const handleFilterCategory = (category: number) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter(id => id !== category))
        } else {
            setSelectedCategories([...selectedCategories, category])
        }
    }

    useEffect(() => {
        if (selectedCategories.length === 0) {
            setFilteredData(data)
        } else {
            setFilteredData(data.filter(row => row.type === 'folder' 
                || selectedCategories.reduce((prev, id) => prev && row.categories.map(cat => cat.id).includes(id), true)))
        }
    }, [data, selectedCategories])

    return { selectedCategories, handleFilterCategory, filteredData }
}