import { useState, type SetStateAction } from "react"
import type { InventoryRow } from "../components/InventoryFolder"
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';

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

export default function useSortingModel() {

    const [ascending, setAscending] = useState(true)
    const [foldersOnTop, setFoldersOnTop] = useState(true)
    const [sortType, setSortType] = useState<InventorySort>('name')

    const handleSort = (setData: React.Dispatch<SetStateAction<InventoryRow[]>>, type: InventorySort) => {
        const asc = sortType === type ? !ascending : true
        const foldersTop = (foldersOnTop && type !== 'foldersMix') || (type === 'foldersOnTop')
        const isFoldersMix = type === 'foldersMix'

        // Sort once based on current sorting type, then return early
        if (isFoldersMix) {
            setFoldersOnTop(false)
            type = sortType
        }

        switch (type) {
            case "name":
                setData(data => [...data.sort(sortByName(asc, foldersTop))])
                break
            case "quantity":
                setData(data => [...data.sort(sortByQuantity(asc, foldersTop))])
                break
            case "lastModified":
                setData(data => [...data.sort(sortByLastModified(asc, foldersTop))])
                break
            case "foldersOnTop":
                setFoldersOnTop(true)
                break
            case "foldersMix":
                // Shouldn't reach here
                break
        }

        // Do not switch the ascending order
        if (isFoldersMix) {
            return
        }

        if (sortType === type) { setAscending(prev => !prev) }
        else if (type !== 'foldersOnTop' && type !== 'foldersMix') {
            setAscending(true)
            setSortType(type)
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

    return { ascending, foldersOnTop, getSortTitle, getSortIcon, handleSort }
}