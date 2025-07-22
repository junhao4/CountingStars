import { useState } from "react"
import AddFolderRow from "./AddFolderRow"
import FolderRow from "./FolderRow"
import ItemRow from "./ItemRow"
import type { InventoryRow } from "../hooks/useGetFolderContent"

interface TableBodyProps {
    folderId: number | 'root'
    sortedData: InventoryRow[]
    addFolderRow: boolean
    setAddFolderRow: React.Dispatch<React.SetStateAction<boolean>>
    setData: React.Dispatch<React.SetStateAction<InventoryRow[]>>
    
}

export default function TableBody({ folderId, sortedData, addFolderRow, setAddFolderRow, setData }: TableBodyProps) {

    return (
        <tbody>
            {addFolderRow && <AddFolderRow folderId={folderId} setData={setData} setAddFolderRow={setAddFolderRow} />}
            {sortedData.map((row, index) => row.type === 'folder'
                ? <FolderRow key={index} folder={row} setData={setData} />
                : <ItemRow key={index} item={row} />)}
        </tbody>
    )
}