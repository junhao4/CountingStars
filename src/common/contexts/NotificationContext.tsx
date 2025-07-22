import { createContext, useContext, useEffect, useState } from "react"
import { useSessionContext } from "./SessionContext"
import { getUnreadNumber } from "../../features/notifications/api/NotificationsApi"

interface NotificationProps {
    unread: number,
    setUnread: React.Dispatch<React.SetStateAction<number>>
} 

const NotificationContext = createContext<NotificationProps>({
    unread: 0,
    setUnread: () => {}
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
        <NotificationContext.Provider value={{ unread, setUnread }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotificationContext = () => useContext(NotificationContext)