import { IconButton } from "@mui/material";
import { useState, type SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { validateMoveIntoFolder } from "../functions/Folder";
import { fetchCurrentFolder, moveItemIntoFolder } from "../api/FolderApi";
import { useAlertContext } from "../../../../../common/contexts/AlertContext";
import type { InventoryRow } from "../hooks/useGetFolderContent";
import { addLog } from "../../../log/api/LogApi";
import { useSessionContext, type ValidSession } from "../../../../../common/contexts/SessionContext";
import { useOrgContext, type ValidOrg } from "../../../../../common/contexts/OrgContext";
import { handleGenerateAlert } from "../../../../../common/functions/ErrorAlerts";

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
    const { user } = useSessionContext() as ValidSession
    const { org } = useOrgContext() as ValidOrg

    const [over, setOver] = useState(false)
    
    const moveIntoFolder = async (moveItem: string, folderId: number | null) => {
        if (!validateMoveIntoFolder(moveItem, folderId).data) {
            return
        }

        // item[0] is the type 'folder' or 'item', item[1] is the id of that item type
        const row = moveItem.split(',')
        const rowType = row[0] as 'folder' | 'item'
        const rowId = parseInt(row[1])

        const curr = await fetchCurrentFolder(rowId)
        if (curr === 'itemError') {
            handleGenerateAlert(curr, createAlert)
            return
        }

        const oldLocation = curr?.Folders?.name ?? "Root"

        const res = await moveItemIntoFolder(rowType, rowId, folderId)
        if (!res) {
            createAlert('error', "Failed to move")
            return
        }

        setData(data => data.filter(row => !(row.type === rowType && row.id === rowId)))
        createAlert('success', "Successfully moved!")

        if (rowType === 'folder') {
            // Do not need to create logs for folder
            return
        }

        const updated = await fetchCurrentFolder(rowId)
        if (updated === 'itemError') {
            handleGenerateAlert(updated, createAlert)
            return
        }
        addLog(org.id, "moveItem", user.id, rowId, { newLocation: updated?.Folders?.name!, oldLocation })
    }

    return (
        <IconButton sx={{ ...(over && { backgroundColor: 'var(--primary-alternative)' }), color: 'var(--primary)' }}
            onClick={() => navigate('/dashboard/organization/inventory/' + folder.id)}
            onDragEnter={() => setOver(true)} onDragLeave={() => setOver(false)}
            onDragOver={e => e.preventDefault()}
            onDrop={e => moveIntoFolder(e.dataTransfer.getData('id'),
                folder.id === 'root' ? null : folder.id as number)}>
            {folder.name}
        </IconButton>
    )
}