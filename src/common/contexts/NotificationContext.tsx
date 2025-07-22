import { createContext, useContext, useEffect, useState } from "react"
import { useSessionContext } from "./SessionContext"
import { getUnreadNumber } from "../../features/notifications/api/NotificationsApi"
import { usePageTitleContext } from "./PageTitleContext"


const NotificationContext = createContext({
    unread : 0
});

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    const [ unread, setUnread ] = useState(0)
    const { session } = useSessionContext()
    const { title } = usePageTitleContext()

    useEffect(() => {
        const get = async () => {
            if (session?.user) {
                setUnread((await getUnreadNumber(session.user.id))!)
            }
        }
        get()
    })
    

    return (
        <NotificationContext.Provider value={{ unread }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotificationContext = () => useContext(NotificationContext)