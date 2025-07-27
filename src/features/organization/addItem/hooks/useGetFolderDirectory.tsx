import { useEffect, useState } from "react";
import type { ItemFolder } from "../../../../helper/types";
import { fetchAllFolders } from "../../inventory/folder/api/FolderApi";
import { useOrgContext, type ValidOrg } from "../../../../common/contexts/OrgContext";


export default function useGetFolderDirectory() {
    const { org } = useOrgContext() as ValidOrg

    const [loading, setLoading] = useState(true)
    const [folders, setFolders] = useState<ItemFolder[]>([])

    useEffect(() => {
        fetchAllFolders(org.id)
            .then(data => setFolders(data))
            .then(() => setLoading(false))
    }, [])


    return { loading, folders }
}

