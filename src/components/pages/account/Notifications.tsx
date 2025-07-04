import { useEffect, useState } from "react";
import { useMessageContext } from "../../contexts/MessageContext";
import "./Notifications.css";
import { useSessionContext } from "../../contexts/SessionContext";
import { usePageTitleContext } from "../../contexts/PageTitleContext";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNotificationContext } from "../../contexts/NotificationContext";
import { createNotificationMessage, deleteNotification, getNotification, markAsRead } from "./AccountController";

export interface NotificationFetch {
    msg?: string;
    time: string;
    id: number;
}


export default function Notifications() {
    const { createMessage } = useMessageContext();
    const { setTitle } = usePageTitleContext();
    const [notifications, setNotifications] = useState<
        (NotificationFetch | undefined)[]
    >([]);
    const { session } = useSessionContext();
    const { countUnread } = useNotificationContext();

    useEffect(() => {
        setTitle("Notifications");
    }, []);

    useEffect(() => {
        if (session) {
            getNotification(session, createNotificationMessage, createMessage, setNotifications);
            markAsRead(session);
            countUnread();
        }
    }, [session]);
   

    if (notifications != null) {
        return (
            <>
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
                        {notifications.map((notif, index) => {
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
                                                deleteNotification(notif!.id, createMessage, setNotifications, notifications)
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
            </>
        );
    } else {
        return <h1>No notifications</h1>;
    }
}
