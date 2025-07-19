import { useNavigate } from "react-router-dom";
import { useOrgContext, type ValidOrg } from "../../../common/contexts/OrgContext";
import Inventory from "../../../features/organization/inventory/table/components/Inventory";
import { useEffect } from "react";
import { usePageTitleContext } from "../../../common/contexts/PageTitleContext";


export default function InventoryPage() {
    const { setTitle } = usePageTitleContext()
    const { org } = useOrgContext() as ValidOrg
    const navigate = useNavigate()

    useEffect(() => {
        if (org === null) navigate("/dashboard");
        setTitle(org.name);
    }, []);

    return (
        <Inventory />
    )
}