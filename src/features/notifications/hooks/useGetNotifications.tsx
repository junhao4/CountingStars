import { useSessionContext } from "../../../common/contexts/SessionContext";
import { getNotification } from "../api/NotificationsApi";
import type { Notification } from "../../../helper/types";
import { useEffect, useState } from "react";

export default function useGetNotifications() {
    const { user } = useSessionContext()

    const [notifications, setNotifications] = useState<Notification[]>([])

    useEffect(() => {
        user && getNotification(user.id)
            .then(data => setNotifications(data))
    }, [user])
    const unread = notifications.filter(notif => notif.status).length

    return { notifications, setNotifications, unread }
}
