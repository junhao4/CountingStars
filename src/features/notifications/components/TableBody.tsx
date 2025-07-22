import DeleteIcon from "@mui/icons-material/Delete"
import { type NotifMessage } from "../hooks/useGetNotifications";
import IconButton from "@mui/material/IconButton";

interface TableBodyProps {
    messages: NotifMessage[]
    handleDelete: (arg0: number) => () => void
}

export default function TableBody({messages, handleDelete}: TableBodyProps) {
    return (
        <tbody className="notifications-table-body">
            {
                messages.length === 0
                    ? <h1>NO NOTIFICATIONS</h1>
                    : messages.map((notif, index) => {
                        return (
                            <tr
                                className="notifications-table-row"
                                key={index}
                            >
                                <td>{index + 1}</td>
                                <td>{notif?.msg}</td>
                                <td>{notif?.time}</td>
                                <td>
                                    <IconButton
                                        onClick={() => handleDelete(notif.id)}
                                        aria-label="delete"
                                        size="large"
                                    >
                                        <DeleteIcon fontSize="inherit" />
                                    </IconButton>
                                </td>
                            </tr>
                        );
                    })}
        </tbody>
    )
}