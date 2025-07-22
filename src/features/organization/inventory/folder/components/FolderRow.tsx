import type { ItemFolder } from "../../../../../helper/types";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FolderIcon from '@mui/icons-material/Folder';
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import { useRef, useState, type SetStateAction } from "react";
import { MenuItem, MenuList, Popover, Tooltip } from "@mui/material";
import { deleteFolder } from "../api/FolderApi";
import { useAlertContext } from "../../../../../common/contexts/AlertContext";
import type { InventoryRow } from "../hooks/useGetFolderContent";


export default function FolderRow({ setData, folder, moveIntoFolder }:
    { folder: ItemFolder, setData: React.Dispatch<SetStateAction<InventoryRow[]>>, moveIntoFolder: (moveItem: string, folderId: number) => void }) {
    const navigate = useNavigate()
    const { createAlert } = useAlertContext()

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

    return (
        <tr draggable className={`${over && "over"}`}
            onDragEnter={() => setOver(true)} onDragLeave={() => setOver(false)}
            onDragStart={e => e.dataTransfer.setData('id', 'folder,' + folder.id)}
            onDragOver={e => (e.preventDefault(),setOver(true))}
            onDrop={e => moveIntoFolder(e.dataTransfer.getData('id'), folder.id)}
            onDoubleClick={() => navigate('../' + folder.id, { relative: 'path' })}>
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