import "./NotificationsTable.css";

import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import Loading from "../../../common/components/Loading";
import useGetNotifications from "../hooks/useGetNotifications";



export default function NotificationTable() {
    const { loading, messages, setNotifications } = useGetNotifications()


    if (loading) {
        return <Loading />
    }

    return (
        <table className="notifications-table">
            <TableHeader />
            <TableBody messages={messages} setNotifications={setNotifications} />
        </table>
    )
}