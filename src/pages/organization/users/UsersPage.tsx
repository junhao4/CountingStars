import { useEffect, useState } from "react";
import UserGrid from "../../../features/organization/users/components/UserGrid";
import { useOrgContext, type ValidOrg } from "../../../common/contexts/OrgContext";
import { usePageTitleContext } from "../../../common/contexts/PageTitleContext";
import AddUserBar from "../../../features/organization/users/components/AddUserBar";
import { useNavigate } from "react-router-dom";

export default function UsersPage() {
  const { org } = useOrgContext() as ValidOrg
  const { setTitle } = usePageTitleContext()

  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    setTitle(org.name + " Users");
  }, []);

  return (
    <div style={{ width: '70%', maxWidth: '70%', margin: '1rem 0' }}>
      <AddUserBar setRefresh={setRefresh} />
      <UserGrid refresh={refresh} />
    </div>
  )
}
