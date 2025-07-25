import { useEffect, useState } from "react";
import UserGrid from "../../../features/organization/users/components/UserGrid";
import { usePageTitleContext } from "../../../common/contexts/PageTitleContext";
import AddUserBar from "../../../features/organization/users/components/AddUserBar";

export default function UsersPage() {
  const { setTitle } = usePageTitleContext()

  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    setTitle("Users");
  }, []);

  return (
    <div style={{ width: '70%', maxWidth: '70%', margin: '1rem 0' }}>
      <AddUserBar setRefresh={setRefresh} />
      <UserGrid refresh={refresh} />
    </div>
  )
}
