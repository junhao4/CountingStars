import { Button, Divider, TextField } from "@mui/material"
import { useState, type SetStateAction } from "react"
import useSortingModel from "../hooks/useSortingModel"
import { useNavigate } from "react-router-dom"
import TableHeader from "./TableHeader"
import useFilterModel from "../hooks/useFilterModel"
import type { InventoryRow } from "../hooks/useGetFolderContent"
import TableBody from "./TableBody"
import './InventoryFolder.css'
import InfoTip from "../../../../../common/components/InfoTip"

export default function InventoryFolder({ data, setData, folderId }:
    { data: InventoryRow[], setData: React.Dispatch<SetStateAction<InventoryRow[]>>, folderId: number | 'root' }) {
    const navigate = useNavigate()

    const { selectedCategories, handleFilterCategory, handleFilterName, filteredData } = useFilterModel(data)
    const { sortedData, foldersOnTop, getSortTitle, getSortIcon, handleSort } = useSortingModel(filteredData)

    const [addFolderRow, setAddFolderRow] = useState(false)

    return (
        <>
            <div className="inventory-search" style={{ display: 'flex', justifyContent:'right', gap: '1rem' }} >
                <TextField onChange={e => handleFilterName(e.target.value)} placeholder="Search by name" sx={{flexGrow:1}} />
                <InfoTip resource="inventory" />
            </div>

            <div className="inventory-body">
                <table className="inventory-table">
                    <TableHeader foldersOnTop={foldersOnTop} handleSort={handleSort}
                        getSortTitle={getSortTitle} getSortIcon={getSortIcon}
                        selectedCategories={selectedCategories} handleFilterCategory={handleFilterCategory} />

                    <TableBody sortedData={sortedData} setData={setData} folderId={folderId}
                        setAddFolderRow={setAddFolderRow} addFolderRow={addFolderRow} />
                </table>
            </div>

            <Divider className="inventory-divider" />

            <div className="inventory-buttons" >
                <Button color="secondary" onClick={() => { setAddFolderRow(prev => !prev) }} children={"Add Folder"} />
                <Button color="secondary" onClick={() => { navigate('../add') }} children={"Add Item"} />
                <Button color="secondary" onClick={() => { navigate('../categories') }} children={"Modify Categories"} />
            </div>
        </>
    )
}