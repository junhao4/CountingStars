import { Button, Badge } from "@mui/material";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications"
import { useNavigate } from "react-router-dom";
import useGetNotifications from "../../../../features/notifications/hooks/useGetNotifications";
import { useNotificationContext } from "../../../contexts/NotificationContext";


export default function AccountBell() {
    const navigate = useNavigate()
    const { unread } = useNotificationContext()

    return (
        <Button size="small" variant="text"
            onClick={() => navigate("/dashboard/notifications")} sx={{ fontSize: 24, color : "var(--primary)" }}
        >
            <Badge badgeContent={unread} color="error">
                <CircleNotificationsIcon fontSize="inherit" />
            </Badge>
        </Button>
    )
}