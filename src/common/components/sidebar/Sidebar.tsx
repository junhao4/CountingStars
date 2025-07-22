import "./Sidebar.css";
import { useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import ViewListIcon from "@mui/icons-material/ViewList";
import GroupIcon from "@mui/icons-material/Group";
import SettingsIcon from "@mui/icons-material/Settings";
import InventoryIcon from "@mui/icons-material/Inventory";
import HistoryIcon from '@mui/icons-material/History';
import { useLocation, useNavigate } from "react-router-dom";
import SidebarItem from "./SidebarItem";


export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  return (
    <>
      <nav
        className={"nav-menu" + (open ? " active" : "") }
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {location.pathname.startsWith("/dashboard/organization")
          ? (<>
            <SidebarItem open={open} selected={location.pathname === "/dashboard"} name="Dashboard"
              navigate={() => navigate("/dashboard")} Icon={ViewListIcon} />

            <SidebarItem open={open} selected={location.pathname === "/dashboard/organization"} name="Organization"
              navigate={() => navigate("/dashboard/organization")} Icon={HomeIcon} />

            <SidebarItem open={open} selected={location.pathname === "/dashboard/organization/users"} name="Users"
              navigate={() => navigate("/dashboard/organization/users")} Icon={GroupIcon} />

            <SidebarItem open={open} selected={location.pathname.startsWith("/dashboard/organization/inventory")} name="Inventory"
              navigate={() => navigate("/dashboard/organization/inventory")} Icon={InventoryIcon} />

            <SidebarItem open={open} selected={location.pathname === "/dashboard/organization/log"} name="Logs"
              navigate={() => navigate("/dashboard/organization/log")} Icon={HistoryIcon} />

            <SidebarItem open={open} selected={location.pathname === "/dashboard/organization/settings"} name="Settings"
              navigate={() => navigate("/dashboard/organization/settings")} Icon={SettingsIcon} />
          </>
          ) : (
            <>
              <SidebarItem open={open} selected={location.pathname === "/"} name="Home"
                navigate={() => navigate("/")} Icon={HomeIcon} />

              <SidebarItem open={open} selected={location.pathname === "/dashboard"} name="Dashboard"
                navigate={() => navigate("/dashboard")} Icon={ViewListIcon} />
            </>
          )}
      </nav>
    </>
  );
}
