import { useEffect } from "react";
import { usePageTitleContext } from "../../common/contexts/PageTitleContext";
import { markAsRead } from "../../features/notifications/api/NotificationsApi";
import { useSessionContext, type ValidSession } from "../../common/contexts/SessionContext";
import NotificationTable from "../../features/notifications/components/NotificationsTable";

export default function NotificationsPage() {
    const { user } = useSessionContext() as ValidSession
    const { setTitle } = usePageTitleContext()

    useEffect(() => {
        setTitle("Notifications");

        new Promise(async () => {
            markAsRead(user.id)
        })
    }, []);


    return (
        <NotificationTable />
    );
}