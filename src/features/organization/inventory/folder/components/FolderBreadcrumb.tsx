import { IconButton } from "@mui/material";
import { useState, type SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { validateMoveIntoFolder } from "../functions/Folder";
import { fetchCurrentFolder, moveItemIntoFolder } from "../api/FolderApi";
import { useAlertContext } from "../../../../../common/contexts/AlertContext";
import type { InventoryRow } from "../hooks/useGetFolderContent";
import { addLog } from "../../../log/api/LogApi";
import { useSessionContext } from "../../../../../common/contexts/SessionContext";
import { useOrgContext } from "../../../../../common/contexts/OrgContext";

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
    const { user } = useSessionContext()
    const { org } = useOrgContext()

    const moveIntoFolder = async (moveItem: string, destinationFolderId: number | null) => {
        if (!validateMoveIntoFolder(moveItem, destinationFolderId).data) {
            return
        }
        const item = moveItem.split(',')
        const curr = await fetchCurrentFolder(parseInt(item[1]))

        const res = await moveItemIntoFolder(item[0] as 'folder' | 'item', parseInt(item[1]), destinationFolderId)
        if (res) {
            setData(data => data.filter(row => !(row.type === item[0] && row.id === parseInt(item[1]))))
            createAlert('success', "Successfully moved!")
            const updated = await fetchCurrentFolder(parseInt(item[1]))
            const updatedFolderName = updated?.Folders?.name ?? "Root"
            addLog(org?.id!, "moveItem", user?.id!, parseInt(item[1]), {newLocation : updatedFolderName, oldLocation : curr?.Folders?.name!})
        } else {
            createAlert('error', "Failed to move!")
        }
    }

    return (
        <IconButton sx={{ ...(over && {backgroundColor: 'var(--primary-alternative)'}), color: 'var(--primary)' }}
            onClick={() => navigate('/dashboard/organization/inventory/' + folder.id)}
            onDragEnter={() => setOver(true)} onDragLeave={() => setOver(false)}
            onDragOver={e => e.preventDefault()}    
            onDrop={e => moveIntoFolder(e.dataTransfer.getData('id'),
                folder.id === 'root' ? null : folder.id as number)}>
            {folder.name}
        </IconButton>
    )
}