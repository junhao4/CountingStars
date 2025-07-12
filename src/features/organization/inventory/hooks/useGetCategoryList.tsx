import { useEffect, useState } from "react";
import { fetchCategoryOptions, type DisplayCategory } from "../api/InventoryApi";
import { useOrgContext, type ValidOrg } from "../../../../common/contexts/OrgContext";


export default function useGetCategoryList() {
    const { org } = useOrgContext() as ValidOrg
    const [categoryList, setCategoryList] = useState<DisplayCategory[]>([])

    useEffect(() => {
        console.log("useGetCategoryList Running for the first time!")
        fetchCategoryOptions(org.id).then(data => setCategoryList(data))
    }, [])

    return { categoryList, setCategoryList }
}