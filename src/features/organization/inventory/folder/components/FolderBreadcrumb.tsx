import { IconButton } from "@mui/material";
import { useState, type SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { validateMoveIntoFolder } from "../functions/Folder";
import { moveItemIntoFolder } from "../api/FolderApi";
import { useAlertContext } from "../../../../../common/contexts/AlertContext";
import type { InventoryRow } from "../hooks/useGetFolderContent";

interface FolderBreadcrumbProps {
    folder: {
        id: number | 'root';
        name: string;
    },
    setData: React.Dispatch<SetStateAction<InventoryRow[]>>
}

export default function FolderBreadcrumb({ folder, setData }: FolderBreadcrumbProps) {
    const navigate = useNavigate()
    const { createAlert } = useAlertContext()
    const [over, setOver] = useState(false)

    const moveIntoFolder = async (moveItem: string, destinationFolderId: number | null) => {
        if (!validateMoveIntoFolder(moveItem, destinationFolderId).data) {
            return
        }
        const item = moveItem.split(',')
        const res = await moveItemIntoFolder(item[0] as 'folder' | 'item', parseInt(item[1]), destinationFolderId)
        if (res) {
            setData(data => data.filter(row => !(row.type === item[0] && row.id === parseInt(item[1]))))
            createAlert('success', "Successfully moved folder!")
        } else {
            createAlert('error', "Failed to move folder!")
        }
    }

    return (
        <IconButton sx={{ ...(over && {backgroundColor: 'var(--secondary-alternative)'}) }}
            color="secondary" onClick={() => navigate('/dashboard/organization/inventory/' + folder.id)}
            onDragEnter={() => setOver(true)} onDragLeave={() => setOver(false)}
            onDragOver={e => e.preventDefault()}    
            onDrop={e => moveIntoFolder(e.dataTransfer.getData('id'),
                folder.id === 'root' ? null : folder.id as number)}>
            {folder.name}
        </IconButton>
    )
}