import { useEffect } from "react";
import AddItem from "../../../features/organization/addItem/components/AddItem";
import { useOrgContext, type ValidOrg } from "../../../common/contexts/OrgContext";
import { usePageTitleContext } from "../../../common/contexts/PageTitleContext";

export default function InventoryAddItemPage() {
  const { org } = useOrgContext() as ValidOrg
  const { setTitle } = usePageTitleContext()

  useEffect(() => {
    setTitle("Add Item")
  }, [])

  return (
    <AddItem />
  )
}
