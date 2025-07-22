import { useEffect, useState } from "react";
import type { InventoryRow } from "./useGetFolderContent";


export default function useFilterModel(data: InventoryRow[]) {
    const [selectedCategories, setSelectedCategories] = useState<number[]>([])
    const [filterText, setFilterText] = useState("")
    const [filteredData, setFilteredData] = useState<InventoryRow[]>(data)

    const handleFilterCategory = (category: number) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter(id => id !== category))
        } else {
            setSelectedCategories([...selectedCategories, category])
        }
    }

    const handleFilterName = (text: string) => {
        setFilterText(text.toLowerCase())
    }

    useEffect(() => {
        var initData = data

        // Filter category
        if (selectedCategories.length === 0) {
            // Do nothing to initData
        } else {
            initData = initData.filter(row => row.type === 'folder' 
                || selectedCategories.reduce((prev, id) => prev && row.categories.map(cat => cat.id).includes(id), true))
        }

        // Filter text
        if (filterText === "") {
            // Do nothing
        } else {
            initData = initData.filter(row => row.name.toLowerCase().includes(filterText))
        }

        setFilteredData(initData)

    }, [data, filterText, selectedCategories])

    return { selectedCategories, handleFilterCategory, handleFilterName, filteredData }
}