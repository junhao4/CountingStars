import { Box, Button, Divider, MenuItem, MenuList, Popover, Tooltip } from "@mui/material"
import type { ItemFolder, ItemWithCategories } from "../../../../../helper/types"
import useGetFolderContent from "../hooks/useGetFolderContent"
import Loading from "../../../../../common/components/Loading"
import { useEffect, useRef, useState, type SetStateAction } from "react"
import useSortingModel from "../hooks/useSortingModel"

import './InventoryFolder.css'
import { moveItemIntoFolder } from "../api/FolderApi"
import { useAlertContext } from "../../../../../common/contexts/AlertContext"
import ItemRow from "./ItemRow"
import FolderRow from "./FolderRow"
import AddFolderRow from "./AddFolderRow"
import { useNavigate } from "react-router-dom"
import InventoryHead from "./InventoryHead"
import useFilterModel from "../hooks/useFilterModel"


export type InventoryRow = (ItemWithCategories & { type: 'item' }) | (ItemFolder & { type: 'folder' })

export default function InventoryFolder({ data, setData, folderId }:
    { data: InventoryRow[], setData: React.Dispatch<SetStateAction<InventoryRow[]>>, folderId: number }) {
    const navigate = useNavigate()
    const { createAlert } = useAlertContext()

    const { loading, items, folders } = useGetFolderContent({ folderId: folderId === 0 ? null : folderId })

    const { foldersOnTop, getSortTitle, getSortIcon, handleSort } = useSortingModel()
    const { selectedCategories, handleFilterCategory, filteredData } = useFilterModel(data)


    useEffect(() => {
        setData([...folders.map(folder => { return { ...folder, type: 'folder' } }) as InventoryRow[],
        ...items.map(item => { return { ...item, type: 'item' } }) as InventoryRow[]])
    }, [folders, items])

    const moveIntoFolder = async (moveItem: string, folderId: number) => {
        const item = moveItem.split(',')
        if (item[0] === 'folder' && parseInt(item[1]) === folderId) {
            return
        }
        const res = await moveItemIntoFolder(item[0] as 'folder' | 'item', parseInt(item[1]), folderId)
        if (res) {
            setData(data.filter(row => !(row.type === item[0] && row.id === parseInt(item[1]))))
            createAlert('success', "Successfully moved folder!")
        } else {
            createAlert('error', "FAILURE!")
        }
    }

    const [addFolderRow, setAddFolderRow] = useState(false)

    if (loading) { return <Loading /> }

    return (
        <Box>
            <table className="inventory-table" width={'100%'}>
                <InventoryHead foldersOnTop={foldersOnTop} setData={setData} handleSort={handleSort} 
                    getSortTitle={getSortTitle} getSortIcon={getSortIcon} 
                    selectedCategories={selectedCategories} handleFilterCategory={handleFilterCategory}/>

                <tbody>
                    {addFolderRow && <AddFolderRow folderId={folderId} setData={setData} setAddFolderRow={setAddFolderRow} />}
                    {filteredData.map((row, index) => row.type === 'folder'
                        ? <FolderRow key={index} folder={row} setData={setData} moveIntoFolder={moveIntoFolder} />
                        : <ItemRow key={index} item={row} />)}
                </tbody>
            </table>

            <Divider sx={{ backgroundColor: 'black', margin: '1rem 0' }} variant="fullWidth" />

            <Button color="secondary" onClick={() => { setAddFolderRow(prev => !prev) }} children={"Add Folder"} />
            <Button color="secondary" onClick={() => { navigate('../add') }} children={"Add Item"} />
            <Button color="secondary" onClick={() => { navigate('../categories') }} children={"Modify Categories"} />
        </Box>
    )
}