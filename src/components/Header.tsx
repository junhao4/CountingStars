import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../helper/supabaseClient";
import { usePageTitleContext } from "./contexts/PageTitleContext";
import { useSessionContext } from "./contexts/SessionContext";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { Badge, Button } from "@mui/material";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNotificationContext } from "./contexts/NotificationContext";

function Header() {
    const { session, loading } = useSessionContext();
    const navigate = useNavigate();
    const { unread } = useNotificationContext();

    const handleUserLogout = () => {
        supabase.auth.signOut();
        navigate("/");
    };

    return (
        <div className="header-container">
            <Link to="/" className="header-logo">
                Counting Stars
                <AutoAwesomeIcon sx={{ color: "yellow", fontSize: "50px" }} />
            </Link>
            <h1 className="header-title">{usePageTitleContext().title}</h1>
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
                        <p style={{ fontSize: "20px", margin: "0" }}>
                            Welcome, {session.user.email}
                        </p>
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
                                onClick={() => navigate("/dashboard/profile")}
                            >
                                <AccountCircleIcon />
                            </Button>
                            <Button
                                size="small"
                                color="secondary"
                                variant="outlined"
                                onClick={() => navigate("/dashboard")}
                            >
                                {" "}
                                Dashboard{" "}
                            </Button>
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
                            <Button
                                size="small"
                                color="secondary"
                                variant="outlined"
                                onClick={handleUserLogout}
                            >
                                Log out
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div
                        style={{
                            display: "flex",
                            gap: "64px",
                            marginRight: "80px",
                        }}
                    >
                        <Link
                            to="/login"
                            style={{ color: "white", fontSize: "24px" }}
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            style={{ color: "white", fontSize: "24px" }}
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
