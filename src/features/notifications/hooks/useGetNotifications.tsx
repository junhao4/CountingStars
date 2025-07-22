import { useSessionContext } from "../../../common/contexts/SessionContext";
import { getNotification } from "../api/NotificationsApi";
import type { Notification } from "../../../helper/types";
import { useEffect, useState } from "react";
import { useNotificationContext } from "../../../common/contexts/NotificationContext";

export default function useGetNotifications() {
    const { user } = useSessionContext()
    const { setUnread } = useNotificationContext()

    const [notifications, setNotifications] = useState<Notification[]>([])

    useEffect(() => {
        user && getNotification(user.id)
            .then(data => setNotifications(data))
            .then(() => setUnread(0))
    }, [user])
    


    return { notifications, setNotifications }
}
