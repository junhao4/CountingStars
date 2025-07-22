import { useEffect, useState } from "react";
import { useOrgContext, type ValidOrg } from "../../../../common/contexts/OrgContext";
import { fetchCategoryOptions } from "../api/ItemApi";

export type DisplayCategory = {
    id: number,
    name: string,
}

export default function useGetCategoryList() {
    const { org } = useOrgContext() as ValidOrg
    const [categoryList, setCategoryList] = useState<DisplayCategory[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        console.log("useGetCategoryList Running for the first time!")
        fetchCategoryOptions(org.id).then(data => setCategoryList(data)).then(() => setLoading(false))
    }, [])

    return { categoryList, setCategoryList, loading }
}