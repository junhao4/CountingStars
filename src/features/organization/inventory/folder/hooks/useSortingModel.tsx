import { useEffect, useState } from "react"
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import type { InventoryRow } from "./useGetFolderContent";

export type InventorySort = 'name' | 'quantity' | 'lastModified' | 'foldersOnTop' | 'foldersMix'

export const sortByName = (ascending: boolean, foldersOnTop: boolean) => (row1: InventoryRow, row2: InventoryRow) => {
    const asc = ascending ? 1 : -1;
    return foldersOnTop
        ? row1.type === 'folder' && row2.type === 'folder'
            ? asc * row1.name.localeCompare(row2.name)
            : row1.type === 'folder'
                ? -1
                : row2.type === 'folder'
                    ? 1
                    : asc * row1.name.localeCompare(row2.name)
        : asc * row1.name.localeCompare(row2.name)
}

export const sortByQuantity = (ascending: boolean, foldersOnTop: boolean) => (row1: InventoryRow, row2: InventoryRow) => {
    const asc = ascending ? -1 : 1
    return foldersOnTop
        ? row1.type === 'folder' && row2.type === 'folder'
            ? asc * row1.name.localeCompare(row2.name)
            : row1.type === 'folder'
                ? -1
                : row2.type === 'folder'
                    ? 1
                    : asc * (row1.quantity - row2.quantity)
        : row1.type === 'folder' && row2.type === 'folder'
            ? asc * row1.name.localeCompare(row2.name)
            : row1.type === 'folder'
                ? 1
                : row2.type === 'folder'
                    ? -1
                    : asc * (row1.quantity - row2.quantity)
}

export const sortByLastModified = (ascending: boolean, foldersOnTop: boolean) => (row1: InventoryRow, row2: InventoryRow) => {
    const asc = ascending ? 1 : -1
    const val = new Date(row1.lastModified) > new Date(row2.lastModified)
        ? -1
        : new Date(row1.lastModified) < new Date(row2.lastModified)
            ? 1
            : 0

    return foldersOnTop
        ? row1.type === 'folder' && row2.type === 'folder'
            ? asc * val
            : row1.type === 'folder'
                ? -1
                : row2.type === 'folder'
                    ? 1
                    : asc * val
        : asc * val
}

export default function useSortingModel(filteredData: InventoryRow[]) {

    const [sortedData, setSortedData] = useState<InventoryRow[]>(filteredData)

    const [ascending, setAscending] = useState(false)
    const [foldersOnTop, setFoldersOnTop] = useState(true)
    const [sortType, setSortType] = useState<InventorySort>('name')

    const sort = (type: InventorySort, asc: boolean, foldersOnTop: boolean) => {
        switch (type) {
            case "name":
                setSortedData([...filteredData.sort(sortByName(asc, foldersOnTop))])
                break
            case "quantity":
                setSortedData([...filteredData.sort(sortByQuantity(asc, foldersOnTop))])
                break
            case "lastModified":
                setSortedData([...filteredData.sort(sortByLastModified(asc, foldersOnTop))])
                break
            case "foldersOnTop":
                // Shouldn't reach here
                break
            case "foldersMix":
                // Shouldn't reach here
                break
        }
    }

    const handleSort = (type: InventorySort) => {
        const asc = sortType === type ? !ascending : true

        switch (type) {
            case "name":
            case "quantity":
            case "lastModified":
                sort(type, asc, foldersOnTop)
                type === sortType ? setAscending(prev => !prev) : setAscending(true)
                setSortType(type)
                break
            case "foldersOnTop":
                sort(sortType, ascending, true)
                setFoldersOnTop(true)
                break
            case "foldersMix":
                sort(sortType, ascending, false)
                setFoldersOnTop(false)
                break
        }
    }

    const getSortTitle = (column: 'name' | 'quantity' | 'category' | 'lastModified') => {
        switch (column) {
            case 'name':
                return (column === sortType && ascending) ? "Sort Z to A" : "Sort A to Z"
            case 'quantity':
                return (column === sortType && ascending) ? "Sort lowest first" : "Sort highest first"
            case "category":
                return ""
            case "lastModified":
                return (column === sortType && ascending) ? "Sort oldest first" : "Sort newest first"
        }
    }

    const getSortIcon = (column: 'name' | 'quantity' | 'category' | 'lastModified') => {
        if (column !== sortType) {
            return (<></>)
        }

        return ascending ? <ArrowCircleUpIcon /> : <ArrowCircleDownIcon />
    }

    useEffect(() => {
        // Do not change the current sort order
        handleSort(foldersOnTop ? 'foldersOnTop' : 'foldersMix')
    }, [filteredData])

    return { sortedData, ascending, foldersOnTop, getSortTitle, getSortIcon, handleSort }
}