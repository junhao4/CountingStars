import IconButton from "@mui/material/IconButton";
import { useState, type SetStateAction } from "react";
import { addNewFolder } from "../api/FolderApi";
import { useOrgContext, type ValidOrg } from "../../../../../common/contexts/OrgContext";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useAlertContext } from "../../../../../common/contexts/AlertContext";
import { validateAddFolderName } from "../functions/Folder";
import type { InventoryRow } from "../hooks/useGetFolderContent";
import TextField from "@mui/material/TextField";

interface AddFolderRowProps {
    folderId: number | 'root', 
    setData: React.Dispatch<SetStateAction<InventoryRow[]>>, 
    setAddFolderRow: React.Dispatch<SetStateAction<boolean>>
}

export default function AddFolderRow({ folderId, setData, setAddFolderRow }: AddFolderRowProps) {
    const { org } = useOrgContext() as ValidOrg
    const { createAlert } = useAlertContext()

    const [folderName, setFolderName] = useState("")
    
    const handleAddFolder = async () => {
        const res = validateAddFolderName(folderName)
        if (res.error) {
            if (res.error === 'Empty Folder Name') {
                createAlert('warning', "Folder name cannot be empty!")
            }
            return
        }

        const newFolder = await addNewFolder(org.id, folderId, folderName)
        if (newFolder) setData(data => [{ ...newFolder, type: 'folder', lastModified: new Date(Date.now()).toDateString() }, ...data])
        setAddFolderRow(false)
    }

    return (
        <tr key={0}>
            <td>
                <TextField value={folderName} onChange={(e) => setFolderName(e.target.value)}
                    slotProps={{input: {endAdornment: <IconButton onClick={handleAddFolder}><AddCircleIcon /></IconButton>}}} />
            </td>
        </tr>)
}