import { useEffect, useState } from "react";
import { useMessageContext } from "../../contexts/MessageContext";
import "./Notifications.css";
import { useSessionContext } from "../../contexts/SessionContext";
import { usePageTitleContext } from "../../contexts/PageTitleContext";
import supabase from "../../../helper/supabaseClient";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNotificationContext } from "../../contexts/NotificationContext";

interface NotificationFetch {
    msg?: string;
    time: string;
    id: number;
}

//Creates message based on data stored in supabase
const createNotificationMessage = async (
    notificationType: number,
    notifierId: string | null,
    organizationId: number,
) => {
    var notifier = ""
    if (notifierId) {
        const { data: notifierData, error: notifierError } = await supabase
            .from("Users")
            .select()
            .eq("user_id", notifierId)
            .single();

        if (notifierError) {
            console.log("user does not exits", notifierError.message)
            return "ERROR"
        } else {
            notifier = notifierData.name || "NO NAME"
        }
    } else {
        notifier = "DELETED_USER"
    }


    const { data: org, error: orgError } = await supabase
        .from("Organizations")
        .select()
        .eq("id", organizationId)
        .single();

    if (orgError) {
        console.log("org does not exist")
    }

    switch (notificationType) {
        // Added to organization
        case 1:
            return (
                notifier +
                " has added you to the organization " +
                org?.name
            );
        // Removed from organization
        case 2:
            return (
                notifier +
                " has removed you from the organization " +
                org?.name
            );
        // Organization was deleted
        case 3:
            return (
                notifier + " has deleted the organization " + org?.name
            );
        // Role update within organization
        case 4:
            return (
                notifier + " has changed your role within " + org?.name
            );
        // Join request accepted
        case 5:
            return (
                notifier + " has accepted your request to join " + org?.name
            );
        // Join request rejected
        case 6:
            return (
                notifier + " has rejected your request to join " + org?.name
            );
    }
};

//Use this function to easier add notifications
export async function addNotification(
    notifier: string,
    receiver: string,
    organisation: number,
    type: number
) {
    const { error } = await supabase
        .from("notifications")
        .insert({
            created_at: new Date().toLocaleString("en-SG", {
                timeZone: "Asia/Singapore",
                hour12: false,
            }),
            notifier: notifier,
            receiver: receiver,
            organisation: organisation,
            type: type,
            status: true,
        });
    if (error) {
        console.log("Notification could not be added");
        return error.message
    } else {
        return null
    }
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
            getNotification();
            markAsRead();
            countUnread();
        }
    }, [session]);
    //TEST
    //addNotification("a4deac40-68ec-4e03-a837-2c97256919b5", "a4deac40-68ec-4e03-a837-2c97256919b5",1,2)

    const markAsRead = async () => {
        const { error } = await supabase
            .from("notifications")
            .update({ status: false })
            .eq("receiver", session!.user.id)
            .eq("status", true);

        if (error) {
            createMessage("error", error.message);
        }
    };

    //Gets notifications from supabase and creates the messages then puts into an array
    const getNotification = async () => {
        const user = session!.user;
        const { data, error } = await supabase
            .from("notifications")
            .select('*')
            .eq("receiver", user.id)
            .order("id", { ascending: false });

        if (data) {
            const noti: NotificationFetch[] = await Promise.all(
                data.map(async (notif) => {
                    const msg = await createNotificationMessage(
                        notif.type,
                        notif.notifier,
                        notif.organisation,
                    );
                    return { id: notif.id, msg: msg, time: notif.created_at };
                })
            );
            setNotifications(noti);
        } else {
            createMessage('error', error.message)
        }
    };

    const deleteNotification = async (id: number) => {
        const { error } = await supabase
            .from("notifications")
            .delete()
            .eq("id", id);

        if (error) {
            createMessage('error', error.message);
        } else {
            setNotifications(notifications.filter((notif) => notif?.id !== id));
        }
    };

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
                                                deleteNotification(notif!.id)
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
