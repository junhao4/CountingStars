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
    <div style={{ width: '60%', margin: '2rem 0' }}>
      <AddUserBar setRefresh={setRefresh} />
      <UserGrid refresh={refresh} />
    </div>
  )
}
