import "./Header.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { usePageTitleContext } from "../contexts/PageTitleContext";
import { useSessionContext } from "../contexts/SessionContext";
import Typography from "@mui/material/Typography"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { Badge, Breadcrumbs, Button } from "@mui/material";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import { useNotificationContext } from "../contexts/NotificationContext";
import AccountMenu from "./AccountMenu.tsx";

function Header() {
    const { session } = useSessionContext()
    const navigate = useNavigate()
    const { unread } = useNotificationContext()
    const location = useLocation()

    const breadcrumbPathnames: string[] = location.pathname.split('/')
    const breadcrumbRoutenames: string[] = [(breadcrumbPathnames.length > 0 ? breadcrumbPathnames[0] : "")]

    for (var i = 1; i < breadcrumbPathnames.length; i++) {
        breadcrumbRoutenames[i] = breadcrumbRoutenames[i - 1] + '/' + breadcrumbPathnames[i]
    }

    return (
        <div className="header-container">
            <div style={{ width: '40%', display: 'flex', alignItems: 'center' }}>
                <div className="header-logo" onClick={() => navigate('/')}>
                    <AutoAwesomeIcon sx={{ fontSize: "2rem", margin: '0 0.5rem' }} />
                    <Typography variant='h5'>Counting Stars</Typography>

                </div>
                <Breadcrumbs sx={{ fontSize: '0.5rem' }}>
                    {breadcrumbPathnames.map((path, index) => {
                        return (
                            <Link to={breadcrumbRoutenames[index]}
                                className="header-breadcrumbs">{path}</Link>
                        )
                    })}
                </Breadcrumbs>
            </div>
            <h2 id='header-title' className="header-title">{usePageTitleContext().title}</h2>
            <div className="header-user-details">
                {session ? (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-start",
                            gap: "8px",
                            marginRight: "1rem",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                width: "100%",
                                justifyContent: "right",
                                gap: "1rem",
                            }}
                        >
                            <Button size="small" color="secondary" variant="text"
                                onClick={() => navigate("/dashboard/notifications")} sx={{ fontSize: 24 }}
                            >
                                <Badge badgeContent={unread} color="error">
                                    <CircleNotificationsIcon fontSize="inherit" />
                                </Badge>
                            </Button>
                            <AccountMenu />
                        </div>
                    </div>
                ) : (
                    <div style={{ display: "flex", justifyContent: 'space-evenly', }} >
                        <Link to="/login" data-testid="header-login-link"
                            style={{ color: "var(--foreground-text)", fontSize: "1rem" }}>
                            Login
                        </Link>

                        <Link to="/register" data-testid="header-register-link"
                            style={{ color: "var(--foreground-text)", fontSize: "1rem" }}>
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Header;
