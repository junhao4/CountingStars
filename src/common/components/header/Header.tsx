import "./Header.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { usePageTitleContext } from "../../contexts/PageTitleContext.tsx";
import { useSessionContext } from "../../contexts/SessionContext.tsx";
import Typography from "@mui/material/Typography"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { Breadcrumbs } from "@mui/material";
import AccountMenu from "./accountMenu/AccountMenu.tsx";

function Header() {
    const { session } = useSessionContext()
    const location = useLocation()
    const navigate = useNavigate()

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
                <Breadcrumbs sx={{ fontSize: '0.5rem'}}>
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
                    <div style={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "right",
                        gap: "1rem",
                    }}
                    >
                        <AccountMenu />
                    </div>
                ) : (
                    <div style={{ display: "flex", justifyContent: 'space-evenly', height: '3.5rem', alignItems:'center' }} >
                        <Link to="/login" data-testid="header-login-link"
                            style={{ color: "var(---text)", fontSize: "1rem" }}>
                            Login
                        </Link>

                        <Link to="/register" data-testid="header-register-link"
                            style={{ color: "var(---text)", fontSize: "1rem" }}>
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Header;
