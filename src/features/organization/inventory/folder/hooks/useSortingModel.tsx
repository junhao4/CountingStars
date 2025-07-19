import { useState, type SetStateAction } from "react"
import type { InventoryRow } from "../components/InventoryFolder"
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';

export type InventorySort = 'name' | 'quantity' | 'lastModified' | 'foldersOnTop' | 'foldersMix'

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
                setData(data => [...data.sort((row1, row2) => (asc ? 1 : -1) * row1.name.localeCompare(row2.name))])
                break
            case "quantity":
                setData(data => [...data.sort((row1, row2) => (row1.type === 'folder' || row2.type === 'folder')
                    ? row2.type === row1.type ? 0 : row1.type === 'folder' ? 1 : -1
                    : (asc ? -1 : 1) * (row1.quantity - row2.quantity))])
                break
            case "lastModified":
                setData(data => [...data.sort((row1, row2) => (asc ? 1 : -1) *
                    (new Date(row1.lastModified) < new Date(row2.lastModified) ? 1
                        : new Date(row1.lastModified) > new Date(row2.lastModified) ? -1 : 0))])
                break
            case "foldersOnTop":
                setFoldersOnTop(true)
                break
            case "foldersMix":
                // Shouldn't reach here
        }

        // Do not switch the ascending order
        if (isFoldersMix) {
            return
        }

        if (foldersTop) {
            setData(data => [...data.sort((row1, row2) =>
                row1.type === row2.type
                    ? 0
                    : row1.type === 'folder' ? -1 : 1)])
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