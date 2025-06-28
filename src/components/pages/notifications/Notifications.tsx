import { useEffect, useState } from "react";
import { useMessageContext } from "../../contexts/MessageContext";
import "./Notifications.css";
import { useOrgContext } from "../../contexts/OrgContext";
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
    notifierId: string,
    organizationId: number,
    receiverId: string
) => {
    const { data: notifier, error: notifierError } = await supabase
        .from("Users")
        .select()
        .eq("user_id", notifierId)
        .single();

    const { data: org, error: orgError } = await supabase
        .from("Organizations")
        .select()
        .eq("id", organizationId)
        .single();

    switch (notificationType) {
        // Added to organization
        case 1:
            return (
                notifier?.name +
                " has added you to the organization " +
                org?.name
            );
        // Removed from organization
        case 2:
            return (
                notifier?.name +
                " has removed you from the organization " +
                org?.name
            );
        // Organization was deleted
        case 3:
            return (
                notifier?.name + " has deleted the organization " + org?.name
            );
        // Role update within organization
        case 4:
            return (
                notifier?.name + " has changed your role within " + org?.name
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
    }
}

export default function Notifications() {
    const { createMessage } = useMessageContext();
    const { getOrgContext } = useOrgContext();
    const orgProps = getOrgContext()!;
    const { setTitle } = usePageTitleContext();
    const [notifications, setNotifications] = useState<
        (NotificationFetch | undefined)[]
    >([]);
    const { session } = useSessionContext();
    const { unread, countUnread } = useNotificationContext();

    useEffect(() => {
        setTitle("Notifications");
    }, []);

    useEffect(() => {
        console.log("TEST");
        let currentTimeInSGT = new Date().toLocaleString("en-SG", {
            timeZone: "Asia/Singapore",
            hour12: false,
        });
    });

    useEffect(() => {
        getNoti();
        markAsRead();
        countUnread();
    }, []);
    //TEST
    //addNotification("a4deac40-68ec-4e03-a837-2c97256919b5", "a4deac40-68ec-4e03-a837-2c97256919b5",1,2)

    const markAsRead = async () => {
        const { data, error } = await supabase
            .from("notifications")
            .update({ status: false })
            .eq("receiver", session!.user.id)
            .eq("status", true);

        if (error) {
            console.log(error);
        }
    };

    //Gets notifications from supabase and creates the messages then puts into an array
    const getNoti = async () => {
        const user = session!.user;
        const { data, error } = await supabase
            .from("notifications")
            .select()
            .eq("receiver", user.id);

        if (data) {
            const noti: NotificationFetch[] = await Promise.all(
                data.map(async (notif) => {
                    const msg = await createNotificationMessage(
                        notif.type!,
                        notif.notifier!,
                        notif.organisation!,
                        orgProps.name
                    );
                    return { id: notif.id, msg: msg, time: notif.created_at };
                })
            );
            setNotifications(noti.reverse());
        }
        console.log("data", data);
    };

    const deleteNotification = async (id: number) => {
        const { data, error } = await supabase
            .from("notifications")
            .delete()
            .eq("id", id);

        if (error) {
            console.log(error);
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
