import { Button, Badge } from "@mui/material";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications"
import { useNavigate } from "react-router-dom";
import useGetNotifications from "../../../../features/notifications/hooks/useGetNotifications";


export default function AccountBell() {
    const navigate = useNavigate()
    const { unread } = useGetNotifications()

    return (
        <Button size="small" variant="text"
            onClick={() => navigate("/dashboard/notifications")} sx={{ fontSize: 24, color : "var(--secondary)" }}
        >
            <Badge badgeContent={unread} color="error">
                <CircleNotificationsIcon fontSize="inherit" />
            </Badge>
        </Button>
    )
}