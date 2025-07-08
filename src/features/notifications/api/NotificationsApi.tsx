import supabase from "../../../helper/supabaseClient";
import type { AlertType } from "../../../common/contexts/AlertContext";
import type { Notification } from "../../../helper/types";

//Use this function to easier add notifications
export const addNotification = async (
    notifier: string,
    receiver: string,
    organisation: number,
    type: number
) => {
    const { error } = await supabase.from("notifications").insert({
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
        return error.message;
    } else {
        return null;
    }
};

//Marks notifications as read
export const markAsRead = async (userId: string) => {
    const { error } = await supabase
        .from("notifications")
        .update({ status: false })
        .eq("receiver", userId)
        .eq("status", true);

    if (error) {
        console.log("error", error.message);
    }
};

//Gets notifications from supabase and creates the messages then puts into an array
export const getNotification: (userId: string) => Promise<Notification[]> = async (userId: string) => {
    const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("receiver", userId)
        .order("id", { ascending: false });

    if (error) {
        console.log("Error receiving notifications")
        return []
    }
    return transformNotificationName(data)

};

//Deletes the notification 
export const deleteNotification = async (
    id: number,
    createAlert: (arg0: AlertType, arg1: string) => void,
    setNotifications: React.Dispatch<
        React.SetStateAction<Notification[]>
    >,
    notifications: Notification[]
) => {
    const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", id);

    if (error) {
        createAlert("error", error.message);
    } else {
        setNotifications(notifications.filter((notif) => notif.id !== id));
    }
};

//Creates message based on data stored in supabase
export const createNotificationMessage = async (
    notificationType: number,
    notifierId: string | null,
    organizationId: number,
) => {
    var notifierName = "NO NAME"
    if (notifierId) {
        const { data: notifierData, error: notifierError } = await supabase
            .from("Users")
            .select("name")
            .eq("user_id", notifierId)
            .single();

        if (notifierError) {
            console.log("user does not exits", notifierError.message)
            return "ERROR"
        }
        notifierName = notifierData.name || notifierName
    }


    const { data: org, error: orgError } = await supabase
        .from("Organizations")
        .select()
        .eq("id", organizationId)
        .single();

    if (orgError) {
        console.log("org does not exist")
        return "ERROR"
    }

    return notificationMessages(notificationType, notifierName, { ...org, createdAt: org.created_at })

};

//Returns the actual notification message given the id
export const notificationMessages = (
    notificationType: number,
    notifier: string,
    org: {
        createdAt: string;
        id: number;
        name: string;
    }
) => {
    switch (notificationType) {
        // Added to organization
        case 1:
            return (
                notifier +
                " has added you to the organization " +
                org.name
            );
        // Removed from organization
        case 2:
            return (
                notifier +
                " has removed you from the organization " +
                org.name
            );
        // Organization was deleted
        case 3:
            return (
                notifier + " has deleted the organization " + org.name
            );
        // Role update within organization
        case 4:
            return (
                notifier + " has changed your role within " + org.name
            );
        // Join request accepted
        case 5:
            return (
                notifier + " has accepted your request to join " + org.name
            );
        // Join request rejected
        case 6:
            return (
                notifier + " has rejected your request to join " + org.name
            );
    }
}

const transformNotificationName = (notifs: {
    created_at: string;
    id: number;
    organisation: number,
    notifier: string | null,
    status: boolean,
    type: number
}[]) => {
    return notifs.map(notif => {
        return {
            ...notif, createdAt: notif.created_at, organizationId: notif.organisation, notifier: notif.notifier
        }
    }) as Notification[]
}