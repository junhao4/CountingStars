import { useEffect, useState } from "react";
import type { ItemWithCategories } from "../../../../helper/types";
import { deleteItems, fetchItems } from "../api/InventoryApi";
import { useOrgContext, type ValidOrg } from "../../../../common/contexts/OrgContext";
import { useSessionContext, type ValidSession } from "../../../../common/contexts/SessionContext";
import { useAlertContext } from "../../../../common/contexts/AlertContext";
import type { GridRowSelectionModel } from "@mui/x-data-grid/models";


export default function useGetTableItems() {
    const { user } = useSessionContext() as ValidSession
    const { org } = useOrgContext() as ValidOrg
    const { createAlert } = useAlertContext()

    const [originalItems, setOriginalItems] = useState<ItemWithCategories[]>([])
    const [filteredItems, setFilteredItems] = useState<ItemWithCategories[]>([])

    // rowSelectionModel.ids contains the rows that are selected in ItemTable, used in handleDelete function.
    const [rowSelectionModel, setRowSelectionModel] =
        useState<GridRowSelectionModel>({ type: "include", ids: new Set() });

    const [loading, setLoading] = useState(true)

    const handleDeleteItems = async () => {
        const res = await deleteItems(user.id, org.id, Array.of(...rowSelectionModel.ids).map(id => id as number))
        if (res) {
            createAlert("success", "Successfully deleted item!")
        } else {
            createAlert("error", "Failed to delete item!")
        }
        setRowSelectionModel({ type: "include", ids: new Set() });

    }

    const handleFilterItems = (filterCategories: string[]) => () => {
        setFilteredItems(originalItems.filter(item => filterCategories.map(name =>
            item.categories.map(cat => cat.name).includes(name)).reduce((prev, next) => prev && next, true)))
    }

    useEffect(() => {
        fetchItems(org.id)
            .then(data => { setOriginalItems(data); setFilteredItems(data) })
            .then(() => setLoading(false))
    }, []);

    return {
        loading, filteredItems, handleFilterItems,
        handleDeleteItems, rowSelectionModel, setRowSelectionModel
    }
}