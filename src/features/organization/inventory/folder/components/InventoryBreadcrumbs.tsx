import Breadcrumbs from "@mui/material/Breadcrumbs";
import { fetchParentFolders } from "../api/FolderApi";
import { useEffect, useState, type SetStateAction } from "react";
import { IconButton } from "@mui/material";
import type { InventoryRow } from "../hooks/useGetFolderContent";
import FolderBreadcrumb from "./FolderBreadcrumb";
import "./InventoryFolder.css"



export default function dInventoryBreadcrumbs({ setData, folderId }:
    { data: InventoryRow[], setData: React.Dispatch<SetStateAction<InventoryRow[]>>, folderId: number | 'root' }) {

    const [parentFolderIds, setParentFolderIds] = useState<{ id: number | 'root', name: string }[]>([])

    

    useEffect(() => {
        fetchParentFolders(folderId)
            .then(data => setParentFolderIds(data))
    }, [folderId])

    return (
        <Breadcrumbs className="inventory-breadcrumb" separator={'>'} sx={{ width: 'fit-content', boxShadow: '0 1px var(--border)' }}>
            {parentFolderIds.map((folder, index) => {
                // If last breadcrumb, prevent dragging item into current folder
                if (index === parentFolderIds.length - 1) {
                    return (
                    <IconButton color="secondary">
                        {folder.name}
                    </IconButton>)
                }

                return <FolderBreadcrumb setData={setData} folder={folder} />
            })}
        </Breadcrumbs>
    )
}