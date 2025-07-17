import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import { useState, type SetStateAction } from "react";
import { addNewFolder } from "../api/FolderApi";
import { useOrgContext, type ValidOrg } from "../../../../../common/contexts/OrgContext";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import type { InventoryRow } from "./InventoryFolder";

export default function AddFolderRow({folderId, setData, setAddFolderRow}: 
    {folderId: number, setData: React.Dispatch<SetStateAction<InventoryRow[]>>, setAddFolderRow: React.Dispatch<SetStateAction<boolean>>}) {
    const { org } = useOrgContext() as ValidOrg

    const [folderName, setFolderName] = useState("")
    const handleAddFolder = async () => {
        if (folderName === "") {
            return
        }
        const newFolder = await addNewFolder(org.id, folderId, folderName)
        if (newFolder) setData(data => [{ ...newFolder, type: 'folder' }, ...data])
        setAddFolderRow(false)
    }

    return (
        <tr key={0}>
            <td>
                <Input value={folderName} onChange={(e) => setFolderName(e.target.value)}
                    endAdornment={<IconButton onClick={handleAddFolder}><AddCircleIcon /></IconButton>} />
            </td>
        </tr>)
}