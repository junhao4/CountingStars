import { useSessionContext } from "../../../common/contexts/SessionContext";
import { getNotification } from "../api/NotificationsApi";
import type { Notification } from "../../../helper/types";
import useLocalStorage from "../../../common/hooks/useLocalStorage";

export default function useGetNotifications() {
    const { user } = useSessionContext()

    const { value: notifications, setValue: setNotifications } = useLocalStorage<Notification>("notifications",
        () => {
            if (user?.id) return getNotification(user.id)
            return Promise.resolve([])
        });
    
    const unread = notifications.filter(notif => notif.status).length

    return { notifications, setNotifications, unread }
}
