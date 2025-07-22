import { createContext, useContext, useEffect, useState } from "react"
import { useSessionContext } from "./SessionContext"
import { getUnreadNumber } from "../../features/notifications/api/NotificationsApi"


const NotificationContext = createContext({
    unread: 0
});

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    const [unread, setUnread] = useState(0)
    const { user } = useSessionContext()

    useEffect(() => {
        const get = async () => {
            if (user) {
                setUnread((await getUnreadNumber(user.id))!)
            }
        }
        get()
    }, [user])


    return (
        <NotificationContext.Provider value={{ unread }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotificationContext = () => useContext(NotificationContext)