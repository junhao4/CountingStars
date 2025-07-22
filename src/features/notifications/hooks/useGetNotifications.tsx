import { useSessionContext, type ValidSession } from "../../../common/contexts/SessionContext";
import { createNotificationMessage, deleteNotification, getNotification } from "../api/NotificationsApi";
import type { Notification } from "../../../helper/types";
import { useEffect, useState } from "react";
import { useNotificationContext } from "../../../common/contexts/NotificationContext";
import { handleGenerateAlert } from "../../../common/functions/ErrorAlerts";
import { useAlertContext } from "../../../common/contexts/AlertContext";

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
    const { user } = useSessionContext() as ValidSession
    const { createAlert } = useAlertContext()
    const { setUnread } = useNotificationContext()

    // Fetch the notifications
    const [loading1, setLoading1] = useState(true)
    const [notifications, setNotifications] = useState<Notification[]>([])

    useEffect(() => {
        loading1 && getNotification(user.id)
            .then(data => setNotifications(data))
            .then(() => setUnread(0))
            .then(() => setLoading1(false))
    }, [user])

    // Fetch and generate the notification messages
    const [loading2, setLoading2] = useState(true)
    const [originalMessages, setOriginalMessages] = useState<NotifMessage[]>([])
    const [messages, setMessages] = useState<NotifMessage[]>([])

    useEffect(() => {
        !loading1 && fetchNotificationMessages(notifications)
            .then(data => (setOriginalMessages(data), setMessages(data)))
            .then(() => setLoading2(false))
    }, [notifications])


    const handleDelete = ((id: number) => async () => {
        const res = await deleteNotification(id)
        if (typeof res === 'string') {
            handleGenerateAlert(res, createAlert)
            return
        }
        createAlert("success", "Successfully deleted log!")

        setNotifications(notifications.filter(notif => notif.id !== id))
        setOriginalMessages(originalMessages.filter(msg => msg.id !== id))
        setMessages(messages.filter(msg => msg.id !== id))
    })

    const handleSearch = (text: string) => {
        const filteredMessages = originalMessages
            .filter(msg => msg.msg.includes(text))

        setMessages(filteredMessages)
    }

    return { loading: loading2, messages, handleDelete, handleSearch }
}

