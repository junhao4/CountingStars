import { Box, Button, Divider, TextField } from "@mui/material"
import { useState, type SetStateAction } from "react"
import useSortingModel from "../hooks/useSortingModel"
import { useNavigate } from "react-router-dom"
import TableHeader from "./TableHeader"
import useFilterModel from "../hooks/useFilterModel"
import type { InventoryRow } from "../hooks/useGetFolderContent"
import TableBody from "./TableBody"
import './InventoryFolder.css'

export default function InventoryFolder({ data, setData, folderId }:
    { data: InventoryRow[], setData: React.Dispatch<SetStateAction<InventoryRow[]>>, folderId: number | 'root' }) {
    const navigate = useNavigate()

    const { selectedCategories, handleFilterCategory, handleFilterName, filteredData } = useFilterModel(data)
    const { sortedData, foldersOnTop, getSortTitle, getSortIcon, handleSort } = useSortingModel(filteredData)


    const [addFolderRow, setAddFolderRow] = useState(false)

    return (
        <>
            <TextField size="small" className="inventory-search" 
                onChange={e => handleFilterName(e.target.value)} placeholder="Search by name" />

            <div className="inventory-body">
                <table className="inventory-table">
                    <TableHeader foldersOnTop={foldersOnTop} handleSort={handleSort}
                        getSortTitle={getSortTitle} getSortIcon={getSortIcon}
                        selectedCategories={selectedCategories} handleFilterCategory={handleFilterCategory} />

                    <TableBody sortedData={sortedData} setData={setData} folderId={folderId}
                        setAddFolderRow={setAddFolderRow} addFolderRow={addFolderRow} />
                </table>

                <Divider sx={{ backgroundColor: 'black', margin: '1rem 0' }} variant="fullWidth" />

                <Button color="secondary" onClick={() => { setAddFolderRow(prev => !prev) }} children={"Add Folder"} />
                <Button color="secondary" onClick={() => { navigate('../add') }} children={"Add Item"} />
                <Button color="secondary" onClick={() => { navigate('../categories') }} children={"Modify Categories"} />
            </div>
        </>
    )
}