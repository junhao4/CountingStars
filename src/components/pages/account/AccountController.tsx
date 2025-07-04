import type { SetStateAction } from "react";
import supabase from "../../../helper/supabaseClient";
import type { VariantType } from "../../contexts/MessageContext";
import type { User } from "../../contexts/SessionContext";
import type { Session } from "@supabase/supabase-js";
import type { NotificationFetch } from "./Notifications";

interface UpdateProfileNameProps {
    newName: string;
    user: User;
    setUser: React.Dispatch<SetStateAction<User | null>>;
    createMessage: (arg0: VariantType, arg1: string) => void;
}

//Account functions

//Creates new user for first time users in supabase with default name and pfp
export const handleFirstTimeUser = async (
    user_id: string,
    user_email: string
) => {
    const { data } = await supabase
        .from("Users")
        .select()
        .eq("user_id", user_id)
        .maybeSingle();

    if (data) {
        // User exists already
    } else {
        const { error } = await supabase
            .from("Users")
            .insert({
                user_id,
                name: "Default User",
                image_file: "Default_pfp.jpg",
                email: user_email,
            })
            .select();

        if (error) {
            console.log("error", error.message);
        }
    }
};

//Updates profile of user
export const updateProfile = async ({
    newName,
    user,
    setUser,
    createMessage,
}: UpdateProfileNameProps) => {
    const { data, error } = await supabase
        .from("Users")
        .update({ name: newName })
        .eq("user_id", user.user_id)
        .select();

    if (data) {
        setUser({ ...user, name: newName });
        createMessage("success", "Successfully set new username!");
    } else {
        console.log("error", error.message);
    }
};

//Notification functions

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
export const markAsRead = async (session: Session | null) => {
    const { error } = await supabase
        .from("notifications")
        .update({ status: false })
        .eq("receiver", session!.user.id)
        .eq("status", true);

    if (error) {
        console.log("error", error.message);
    }
};

//Gets notifications from supabase and creates the messages then puts into an array
export const getNotification = async (
    session: Session | null,
    createNotificationMessage: (
        notificationType: number,
        notifierId: string | null,
        organizationId: number
    ) => Promise<string | undefined>,
    createMessage: (arg0: VariantType, arg1: string) => void,
    setNotifications: React.Dispatch<
        React.SetStateAction<(NotificationFetch | undefined)[]>
    >
) => {
    const user = session!.user;
    const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("receiver", user.id)
        .order("id", { ascending: false });

    if (data) {
        const noti: NotificationFetch[] = await Promise.all(
            data.map(async (notif) => {
                const msg = await createNotificationMessage(
                    notif.type,
                    notif.notifier,
                    notif.organisation
                );
                return { id: notif.id, msg: msg, time: notif.created_at };
            })
        );
        setNotifications(noti);
    } else {
        createMessage("error", "could not receive notifications");
    }
};

//Deletes the notification 
export const deleteNotification = async (
    id: number,
    createMessage: (arg0: VariantType, arg1: string) => void,
    setNotifications: React.Dispatch<
        React.SetStateAction<(NotificationFetch | undefined)[]>
    >,
    notifications: (NotificationFetch | undefined)[]
) => {
    const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", id);

    if (error) {
        createMessage("error", error.message);
    } else {
        setNotifications(notifications.filter((notif) => notif?.id !== id));
    }
};

//Creates message based on data stored in supabase
export const createNotificationMessage = async (
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

    return notificationMessages(notificationType, notifier, org)
    
};

//Returns the actual notification message given the id
export const notificationMessages = (
    notificationType : number,
    notifier : string,
    org : {
    created_at: string;
    id: number;
    image_file: string | null;
    name: string;
} | null
) => {
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
}

