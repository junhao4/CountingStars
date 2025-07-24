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
import { useOrgContext } from "../../../../../common/contexts/OrgContext";
import { useSessionContext } from "../../../../../common/contexts/SessionContext";


export default function FolderRow({ setData, folder }:
    { folder: ItemFolder, setData: React.Dispatch<SetStateAction<InventoryRow[]>> }) {
    const navigate = useNavigate()
    const { createAlert } = useAlertContext()
    const { user } = useSessionContext()
    const { org } = useOrgContext()
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

        const item = moveItem.split(',')
        const curr = await fetchCurrentFolder(parseInt(item[1]))
        const currFolderName = curr?.Folders?.name! ?? "Root"
        const res = await moveItemIntoFolder(item[0] as 'folder' | 'item', parseInt(item[1]), folderId)
        if (res) {
            setData(data => data.filter(row => !(row.type === item[0] && row.id === parseInt(item[1]))))
            createAlert('success', "Successfully moved!")
            const updated = await fetchCurrentFolder(parseInt(item[1]))
            addLog(org?.id!, "moveItem", user?.id!, parseInt(item[1]), {newLocation : updated?.Folders?.name!, oldLocation : currFolderName})
        } else {
            createAlert('error', "Failed to move")
        }
    }

    return (
        <tr draggable className={`${over && "over"}`}
            onDragEnter={() => setOver(true)} onDragLeave={() => setOver(false)}
            onDragStart={e => e.dataTransfer.setData('id', 'folder,' + folder.id)}
            onDragOver={e => (e.preventDefault(), setOver(true))}
            onDrop={e => moveIntoFolder(e.dataTransfer.getData('id'), folder.id)}
            onDoubleClick={() => navigate('../' + folder.id, { relative: 'path' })}>
            <td></td>
            <td><FolderIcon />&ensp;{folder.name}</td>
            <td></td>
            <td></td>
            <td>{folder.lastModified}</td>
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