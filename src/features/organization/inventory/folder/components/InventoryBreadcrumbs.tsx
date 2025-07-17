import Breadcrumbs from "@mui/material/Breadcrumbs";
import { fetchParentFolders, moveItemIntoFolder } from "../api/FolderApi";
import { useEffect, useState, type SetStateAction } from "react";
import { data, Link, useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import { useAlertContext } from "../../../../../common/contexts/AlertContext";
import type { InventoryRow } from "./InventoryFolder";


export default function InventoryBreadcrumbs({ data, setData, folderId }:
    { data: InventoryRow[], setData: React.Dispatch<SetStateAction<InventoryRow[]>>, folderId: number }) {
    const navigate = useNavigate()
    const { createAlert } = useAlertContext()

    const [parentFolderIds, setParentFolderIds] = useState<{ id: number | string, name: string }[]>([])

    const moveIntoFolder = async (moveItem: string, destinationFolderId: number | null) => {
        const item = moveItem.split(',')

        const res = await moveItemIntoFolder(item[0] as 'folder' | 'item', parseInt(item[1]), destinationFolderId)
        if (res) {
            setData(data.filter(row => !(row.type === item[0] && row.id === parseInt(item[1]))))
            createAlert('success', "Successfully moved folder!")
        } else {
            createAlert('error', "FAILURE!")
        }
    }

    useEffect(() => {
        fetchParentFolders(folderId)
            .then(data => setParentFolderIds(data))
    }, [folderId])

    return (
        <Breadcrumbs separator={'>'} sx={{ width: 'fit-content', boxShadow: '0 1px var(--secondary-alternative)' }}>
            {parentFolderIds.map((folder, index) => {
                // If last breadcrumb, prevent dragging item into current folder
                if (index === parentFolderIds.length - 1) {
                    return (<IconButton color="secondary">
                        {folder.name}
                    </IconButton>)
                }

                return (
                    <IconButton color="secondary" onClick={() => navigate('/dashboard/organization/inventory/' + folder.id)}
                        onDragOver={e => e.preventDefault()} onDrop={e => moveIntoFolder(e.dataTransfer.getData('id'), folder.id === 'root' ? null : folder.id as number | null)}>
                        {folder.name}
                    </IconButton>
                )
            })}
        </Breadcrumbs>
    )
}