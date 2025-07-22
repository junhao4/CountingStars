import React, { type SetStateAction } from "react";
import { deleteNotification } from "../api/NotificationsApi";
import type { Notification } from "../../../helper/types";
import DeleteIcon from "@mui/icons-material/Delete"
import { useAlertContext } from "../../../common/contexts/AlertContext";
import { type NotifMessage } from "../hooks/useGetNotifications";
import IconButton from "@mui/material/IconButton";
import { handleGenerateAlert } from "../../../common/functions/ErrorAlerts";

interface TableBodyProps {
    messages: NotifMessage[]
    setNotifications: React.Dispatch<SetStateAction<Notification[]>>
}

export default function TableBody({messages, setNotifications}: TableBodyProps) {
    const { createAlert } = useAlertContext()
    
    const handleDelete = (messageId: number) => async () => {
        const res = await deleteNotification(messageId)
        if (typeof res === 'string') {
            handleGenerateAlert(res, createAlert)
            return
        }
        setNotifications(notifs => notifs.filter(notif => notif.id !== messageId))
    }

    return (
        <tbody className="notifications-table-body">
            {
                messages.length === 0
                    ? <h1>NO NOTIFICATIONS</h1>
                    : messages.map((notif, index) => {
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
                                            handleDelete(notif.id)
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
    )
}