import { useSessionContext } from "../../../common/contexts/SessionContext";
import { createNotificationMessage, getNotification } from "../api/NotificationsApi";
import type { Notification } from "../../../helper/types";
import { useEffect, useState } from "react";
import { useNotificationContext } from "../../../common/contexts/NotificationContext";

export type NotifMessage = {
    id: number,
    msg: string,
    time: string
}


const fetchNotificationMessages = (notifications: Notification[]) => {
    return Promise.all(notifications.map(async (notif) => {
        return {
            id: notif.id, msg: await createNotificationMessage(notif.type, notif.notifier, notif.organizationId) || "ERROR",
            time: notif.createdAt
        }
    }))
}


export default function useGetNotifications() {
    const { user } = useSessionContext()
    const { setUnread } = useNotificationContext()

    const [loading1, setLoading1] = useState(true)
    const [notifications, setNotifications] = useState<Notification[]>([])

    useEffect(() => {
        user && getNotification(user.id)
            .then(data => setNotifications(data))
            .then(() => setUnread(0))
            .then(() => setLoading1(false))
    }, [user])


    const [loading2, setLoading2] = useState(true)
    const [messages, setMessages] = useState<NotifMessage[]>([])

    useEffect(() => {
        !loading1 && fetchNotificationMessages(notifications)
            .then(data => setMessages(data))
            .then(() => setLoading2(false))
    }, [notifications])

    const handleSetNotification = ((arg0: React.SetStateAction<Notification[]>) => {
        setLoading1(true)
        setNotifications(arg0)
    })

    return { loading: loading2, messages, setNotifications: handleSetNotification }
}

