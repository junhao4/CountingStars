import { useEffect, useState } from "react"
import { useMessageContext } from "../../contexts/MessageContext"
import "./Notifications.css"
import { useOrgContext } from "../../contexts/OrgContext"
import { useSessionContext } from "../../contexts/SessionContext"
import { usePageTitleContext } from "../../contexts/PageTitleContext"


interface NotificationFetch {
    notifier: string,
    orgName: string,
    typeId: number,
    date: Date,
    status: boolean,
}


const createNotificationMessage = (notificationType: number, notifier: string, organization: string, receiver: string) => {
    switch (notificationType) {
        // Added to organization
        case 1: return notifier + " has added you to the organization " + organization
        // Removed from organization
        case 2: return notifier + " has removed from the organization " + organization
        // Organization was deleted
        case 3: return notifier + " has deleted the organization " + organization
        // Role update within organization
        case 4: return notifier + " has changed your role within " + organization
        default: return "Error"
    }
}

export default function Notifications() {
    const { createMessage } = useMessageContext()
    const { getOrgContext } = useOrgContext()
    const orgProps = getOrgContext()!
    const { setTitle } = usePageTitleContext()
    const [notifications, setNotifications] = useState<NotificationFetch[]>([{notifier: 'Yitao', orgName: orgProps.name, typeId: 1, date: new Date(),status: false}])

    useEffect(() => {
        setTitle("Notifications")
    }, [])

    return (
        <table className="notifications-table">
            <thead>
                <tr className="notifications-table-row notifications-table-header">
                    <td>Index</td>
                    <td>Message</td>
                    <td>Time</td>
                    <td>Actions</td>
                </tr>
            </thead>
            <tbody>
                {notifications.map((notif, index) => {
                    return (<tr className="notifications-table-row" key={index}>
                        <td>{index + 1}</td>
                        <td>{createNotificationMessage(notif.typeId, notif.notifier, notif.orgName, orgProps.name)}</td>
                        <td>{notif.date.toLocaleString()}</td>
                        <td>Actions</td>
                    </tr>)
                })}
            </tbody>
        </table>
    )
}