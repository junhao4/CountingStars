import { Badge, IconButton, Tooltip } from "@mui/material";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications"
import { useNavigate } from "react-router-dom";
import { useNotificationContext } from "../../../contexts/NotificationContext";


export default function AccountBell() {
    const navigate = useNavigate()
    const { unread } = useNotificationContext()

    return (
        <Tooltip title={"Notifications"}>
            <IconButton size="small"
                onClick={() => navigate("/dashboard/notifications")} sx={{ fontSize: 24, color: "var(--primary)" }}
            >
                <Badge badgeContent={unread} color="error">
                    <CircleNotificationsIcon fontSize="inherit" />
                </Badge>
            </IconButton>
        </Tooltip>
    )
}