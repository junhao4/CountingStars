import "./NotificationsTable.css"

export default function TableHeader() {
    return (
        <thead>
            <tr className="notifications-table-row notifications-table-header">
                <td width={"10%"}>Index</td>
                <td width={"50%"}>Message</td>
                <td width={"25%"}>Time (SGT)</td>
                <td width={"15%"}>Actions</td>
            </tr>
        </thead>
    )
}