import Breadcrumbs from "@mui/material/Breadcrumbs";
import { fetchParentFolders } from "../api/FolderApi";
import { useEffect, useState, type SetStateAction } from "react";
import { IconButton } from "@mui/material";

import { useAlertContext } from "../../../../../common/contexts/AlertContext";
import type { InventoryRow } from "../hooks/useGetFolderContent";
import { validateMoveIntoFolder } from "../functions/Folder";
import InfoTip from "../../../../../common/components/InfoTip";
import FolderBreadcrumb from "./FolderBreadcrumb";
import "./InventoryFolder.css"



export default function InventoryBreadcrumbs({ setData, folderId }:
    { data: InventoryRow[], setData: React.Dispatch<SetStateAction<InventoryRow[]>>, folderId: number | 'root' }) {

    const [parentFolderIds, setParentFolderIds] = useState<{ id: number | 'root', name: string }[]>([])

    

    useEffect(() => {
        fetchParentFolders(folderId)
            .then(data => setParentFolderIds(data))
    }, [folderId])

    return (

        <>
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
        <InfoTip 
                header={["Navigation", "Moving items", "Sorting", "Filtering", "Folder view"]}
                body={["Double-click to view an item or enter a folder.",
                    "Drag any row into another folder or the yellow directory name above to move them.",
                    "Click on 'Name', 'Quantity', 'Last Modified' to sort. Click again to sort in reverse order.",
                    "Click on 'Categories' to select and apply your filters",
                    "Click on 'Sort' to choose whether to display folders on top or mixed."]} />
        </>

    )
}