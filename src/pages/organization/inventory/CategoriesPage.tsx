import { useEffect } from "react";
import { useOrgContext, type ValidOrg } from "../../../common/contexts/OrgContext";
import { usePageTitleContext } from "../../../common/contexts/PageTitleContext";
import Category from "../../../features/organization/categories/components/Category";


export default function CategoriesPage() {
    const { setTitle } = usePageTitleContext()
    const { org } = useOrgContext() as ValidOrg

    useEffect(() => {
        setTitle(org.name)
    }, [])

    return (
        <Category />
    )
}