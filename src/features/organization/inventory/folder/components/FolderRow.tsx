import type { ItemFolder } from "../../../../../helper/types";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FolderIcon from '@mui/icons-material/Folder';
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import { useRef, useState, type SetStateAction } from "react";
import { MenuItem, MenuList, Popover, Tooltip } from "@mui/material";
import { deleteFolder, fetchCurrentFolder, moveItemIntoFolder } from "../api/FolderApi";
import { useAlertContext } from "../../../../../common/contexts/AlertContext";
import type { InventoryRow } from "../hooks/useGetFolderContent";
import { validateMoveIntoFolder } from "../functions/Folder";
import { addLog } from "../../../log/api/LogApi";
import { useOrgContext, type ValidOrg } from "../../../../../common/contexts/OrgContext";
import { useSessionContext, type ValidSession } from "../../../../../common/contexts/SessionContext";
import { hasPermission } from "../../../../../helper/RolePermissions";
import { handleGenerateAlert } from "../../../../../common/functions/ErrorAlerts";


export default function FolderRow({ setData, folder }:
    { folder: ItemFolder, setData: React.Dispatch<SetStateAction<InventoryRow[]>> }) {
    const navigate = useNavigate()
    const { createAlert } = useAlertContext()
    const { user } = useSessionContext() as ValidSession
    const { org } = useOrgContext() as ValidOrg
    const userWithOrg = { userId: user.id, organizationId: org.id, role: org.role }

    const [over, setOver] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const ref = useRef(null)

    const handleDelete = async () => {
        const res = await deleteFolder(folder.id)
        if (res) {
            setData(data => data.filter(row => row.id !== folder.id))
            createAlert("success", "Successfully deleted folder!")
        } else {
            createAlert("error", "Failed to delete folder")
        }
        setMenuOpen(false)
    }

    const moveIntoFolder = async (moveItem: string, folderId: number) => {
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
        <tr style={{userSelect:'none'}}
            draggable={hasPermission(userWithOrg, "inventory", "update")} className={`${over && "over"}`}
            onDragEnter={() => setOver(true)} onDragLeave={() => setOver(false)}
            onDragStart={e => e.dataTransfer.setData('id', 'folder,' + folder.id)}
            onDragOver={e => (e.preventDefault(), setOver(true))}
            onDrop={e => moveIntoFolder(e.dataTransfer.getData('id'), folder.id)}
            onDoubleClick={() => navigate('../' + folder.id, { relative: 'path' })}>
            <td></td>
            <td><FolderIcon />&ensp;{folder.name}</td>
            <td></td>
            <td></td>
            <td ><p draggable={hasPermission(userWithOrg, "inventory", "update")}>{folder.lastModified}</p></td>
            <td>
                <Tooltip title="More Actions">
                    <IconButton ref={ref} onClick={() => setMenuOpen(prev => !prev)}>
                        <MoreVertIcon />
                    </IconButton>
                </Tooltip>
                <Popover open={menuOpen} anchorEl={ref.current} onClose={() => setMenuOpen(false)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
                    <MenuList disablePadding>
                        <MenuItem onClick={handleDelete}>Delete Folder</MenuItem>
                    </MenuList>
                </Popover>
            </td>
        </tr>
    )
}