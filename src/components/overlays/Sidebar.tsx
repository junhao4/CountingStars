import "./Sidebar.css";
import React, { useState } from "react";
import { Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ViewListIcon from "@mui/icons-material/ViewList";
import GroupIcon from "@mui/icons-material/Group";
import SettingsIcon from "@mui/icons-material/Settings";
import InventoryIcon from "@mui/icons-material/Inventory";
import HistoryIcon from '@mui/icons-material/History';
import { useLocation, useNavigate } from "react-router-dom";

interface NavBarItemProps {
  open: boolean;
  selected: boolean;
  children: React.ReactNode;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

const NavBarItem = ({ open, selected, children, onClick }: NavBarItemProps) => {
  return (
    <div
      className={
        (open ? "nav-menu-item-container active" : "nav-menu-item-container") +
        (selected ? " selected" : "")
      }
      onClick={onClick}
    >
      <div className={open ? "nav-menu-item active" : "nav-menu-item"}>
        {children}
      </div>
    </div>
  );
};

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  return (
    <>
      <div style={{ width: "4rem" }} />
      <nav
        className="nav-menu"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {location.pathname.startsWith("/dashboard/organization") ? (
          <>
            <NavBarItem
              open={open}
              selected={location.pathname === "/dashboard/organization"}
              onClick={() => navigate("/dashboard/organization")}
            >
              <HomeIcon fontSize="large" />
              <Typography>Home</Typography>
            </NavBarItem>

            <NavBarItem
              open={open}
              selected={location.pathname === "/dashboard/organization/users"}
              onClick={() => navigate("/dashboard/organization/users")}
            >
              <GroupIcon fontSize="large" />
              <Typography>Users</Typography>
            </NavBarItem>

            <NavBarItem
              open={open}
              selected={
                location.pathname === "/dashboard/organization/inventory"
              }
              onClick={() => navigate("/dashboard/organization/inventory")}
            >
              <InventoryIcon fontSize="large" />
              <Typography>Inventory</Typography>
            </NavBarItem>

            <NavBarItem
              open={open}
              selected={
                location.pathname === "/dashboard/organization/log"
              }
              onClick={() => navigate("/dashboard/organization/log")}
            >
              <HistoryIcon fontSize="large" />
              <Typography>Logs</Typography>
            </NavBarItem>

            <NavBarItem
              open={open}
              selected={
                location.pathname === "/dashboard/organization/settings"
              }
              onClick={() => navigate("/dashboard/organization/settings")}
            >
              <SettingsIcon fontSize="large" />
              <Typography>Settings</Typography>
            </NavBarItem>
          </>
        ) : (
          <>
            <NavBarItem open={open} onClick={() => navigate("/")} selected={location.pathname === "/"}>
              <HomeIcon fontSize="large" />
              <Typography>Home</Typography>
            </NavBarItem>
            <NavBarItem open={open} onClick={() => navigate("/dashboard")} selected={location.pathname === "/dashboard"}>
              <ViewListIcon fontSize="large" />
              <Typography>Dashboard</Typography>
            </NavBarItem>
          </>
        )}
      </nav>
    </>
  );
}
