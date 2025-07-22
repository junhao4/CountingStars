import "./NotificationsTable.css"

export default function TableHeader() {
    return (
        <thead>
            <tr className="notifications-table-row notifications-table-header">
                <td>Index</td>
                <td>Message</td>
                <td>Time (SGT)</td>
                <td>Actions</td>
            </tr>
        </thead>
    )
}