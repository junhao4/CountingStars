import { useEffect } from "react";
import AddItem from "../../../features/organization/addItem/components/AddItem";
import { useOrgContext, type ValidOrg } from "../../../common/contexts/OrgContext";
import { usePageTitleContext } from "../../../common/contexts/PageTitleContext";
import { useSessionContext, type ValidSession } from "../../../common/contexts/SessionContext";
import { hasPermission } from "../../../helper/RolePermissions";
import { useNavigate } from "react-router-dom";
import { useAlertContext } from "../../../common/contexts/AlertContext";

export default function InventoryAddItemPage() {
  const { org } = useOrgContext() as ValidOrg
  const { setTitle } = usePageTitleContext()
  const { user } = useSessionContext() as ValidSession
  const userWithOrg = { userId: user.id, organizationId: org.id, role: org.role }
  const navigate = useNavigate()
  const { createAlert } = useAlertContext()

  useEffect(() => {
    setTitle("Add Item")
    if (!hasPermission(userWithOrg, "inventory", "update")) {
      createAlert("error", "Members cannot edit inventory!!!")
      navigate(-1)
    }
  }, [])

  

  return (
    <AddItem />
  )
}
