import { useNavigate } from "react-router-dom";
import { useOrgContext } from "../../../common/contexts/OrgContext";
import Inventory from "../../../features/organization/inventory/components/Inventory";
import { useEffect } from "react";
import { usePageTitleContext } from "../../../common/contexts/PageTitleContext";


export default function InventoryPage() {
    const { setTitle } = usePageTitleContext()
    const orgProps = useOrgContext().getOrgContext()
    const navigate = useNavigate()

    useEffect(() => {
        if (orgProps === null) navigate("/dashboard");
        setTitle(orgProps!.name);
    }, []);

    return (
        <Inventory />
    )
}