import { useEffect } from "react";
import { usePageTitleContext } from "../../common/contexts/PageTitleContext";
import { markAsRead } from "../../features/notifications/api/NotificationsApi";
import { useSessionContext, type ValidSession } from "../../common/contexts/SessionContext";
import Loading from "../../common/components/Loading";
import TableHeader from "../../features/notifications/components/TableHeader";
import useGetNotifications from "../../features/notifications/hooks/useGetNotifications";
import TableBody from "../../features/notifications/components/TableBody";
import "../../features/notifications/components/NotificationsTable.css";
import SearchBar from "../../features/notifications/components/SearchBar";

export default function NotificationsPage() {
    const { user } = useSessionContext() as ValidSession
    const { setTitle } = usePageTitleContext()

    const { loading, messages, handleSearch, handleDelete } = useGetNotifications()

    useEffect(() => {
        setTitle("Notifications");

        markAsRead(user.id)
    }, []);

    if (loading) {
        return <Loading />
    }

    return (
        <div style={{ width: '60%' }}>
            <SearchBar handleSearch={handleSearch} />
            <table width={'100%'} className="notifications-table">
                <TableHeader />
                {messages.length === 0
                    ? <tr style={{width:'100%'}}>
                        <td colSpan={4} style={{textAlign:'center'}}>
                            <h4>NO MESSAGES</h4>
                        </td>
                    </tr>
                    : <TableBody messages={messages} handleDelete={handleDelete} />
                }
            </table>
        </div>
    )
}