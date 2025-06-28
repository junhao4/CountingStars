import React from "react";

import { createContext, useContext, useEffect, useState } from "react";
import { useSessionContext } from "./SessionContext";
import supabase from "../../helper/supabaseClient";

interface NotificationProps {
    unread: number;
    countUnread: () => Promise<void>;
}

export const NotificationContext = createContext<NotificationProps>({
    unread: 0,
    countUnread: async () => {},
});

export const NotificationProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const { session } = useSessionContext();
    const [unread, setUnread] = useState(0);

    const countUnread = async () => {
        if (!session?.user.id) {
            setUnread(0);
            return;
        }
        const { data } = await supabase
            .from("notifications")
            .select("id")
            .eq("receiver", session!.user.id)
            .eq("status", true);

        if (data) {
            setUnread(data.length);
        }
    };

    useEffect(() => {
        countUnread();
    }, [session]);

    return (
        <NotificationContext.Provider value={{ unread, countUnread }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotificationContext = () => useContext(NotificationContext);
