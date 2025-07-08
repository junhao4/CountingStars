import "./NotificationsTable.css";
import useGetNotifications from "../hooks/useGetNotifications";
import { IconButton } from "@mui/material";
import { createNotificationMessage, deleteNotification } from "../api/NotificationsApi";
import { useAlertContext } from "../../../common/contexts/AlertContext";
import DeleteIcon from "@mui/icons-material/Delete"
import useLocalStorage from "../../../common/hooks/useLocalStorage";
import { useEffect } from "react";
import type { Notification } from "../../../helper/types";

const fetchNotificationMessages = (notifications: Notification[]) => {
    return Promise.all(notifications.map(async (notif) => {
        return {
            id: notif.id, msg: await createNotificationMessage(notif.type, notif.notifier, notif.organizationId) || "ERROR",
            time: notif.createdAt
        }
    }))
}

export default function NotificationTable() {
    const { notifications, setNotifications } = useGetNotifications()
    const { createAlert } = useAlertContext()

    const { value: notifs, setValue: setNotifs } = useLocalStorage("notification_table",
        () => fetchNotificationMessages(notifications))

    useEffect(() => {
        fetchNotificationMessages(notifications).then(data => setNotifs(data))
    }, [notifications])

    if (notifs.length === 0) {
        return (
            <h1>No notifications</h1>
        )
    }
    return (
        <table className="notifications-table">
            <thead>
                <tr className="notifications-table-row notifications-table-header">
                    <td>Index</td>
                    <td>Message</td>
                    <td>Time (SGT)</td>
                    <td>Actions</td>
                </tr>
            </thead>
            <tbody>
                {notifs.map((notif, index) => {
                    return (
                        <tr
                            className="notifications-table-row"
                            key={index}
                        >
                            <td>{index + 1}</td>
                            <td>{notif?.msg}</td>
                            <td>{notif?.time}</td>
                            <td>
                                <IconButton
                                    onClick={() =>
                                        deleteNotification(notif.id, createAlert, setNotifications, notifications)
                                    }
                                    aria-label="delete"
                                    size="large"
                                >
                                    <DeleteIcon fontSize="inherit" />
                                </IconButton>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    )
}