import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../helper/supabaseClient";
import { usePageTitleContext } from "./contexts/PageTitleContext";
import { useSessionContext } from "./contexts/SessionContext";
import Typography from "@mui/material/Typography"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { Badge, Button } from "@mui/material";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";

import { useNotificationContext } from "./contexts/NotificationContext";
import AccountMenu from "./AccountMenu";

function Header() {
    const { session } = useSessionContext()
    const navigate = useNavigate()
    const { unread } = useNotificationContext()

    const handleUserLogout = () => {
        supabase.auth.signOut()
        navigate("/")
    };

    return (
        <div className="header-container">
            <div onClick={() => navigate('/')} className="header-logo">
                <Typography variant='h6'>Counting Stars</Typography>
                <AutoAwesomeIcon sx={{ fontSize: "30px" }} />
            </div>
            <h2 className="header-title">{usePageTitleContext().title}</h2>
            <div className="header-user-details">
                {session ? (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-start",
                            gap: "8px",
                            marginRight: "48px",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                width: "100%",
                                justifyContent: "space-evenly",
                                gap: "4px",
                            }}
                        >
                        <Button
                            size="small"
                            color="secondary"
                            variant="outlined"
                            onClick={() =>
                                navigate("/dashboard/notifications")
                            }
                        >
                            <Badge badgeContent={unread} color="error">
                                <CircleNotificationsIcon />
                            </Badge>
                        </Button>
                        <AccountMenu />
                        </div>
                    </div>
                ) : (
                    <div
                        style={{
                            display: "flex",
                            gap: "64px",
                            margin: "0 60px",
                        }}
                    >
                        <Link
                            to="/login"
                            style={{ color: "var(--foreground-text)", fontSize: "24px" }}
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            style={{ color: "var(--foreground-text)", fontSize: "24px" }}
                        >
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Header;
