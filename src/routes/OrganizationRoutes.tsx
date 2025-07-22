import { Routes, Route } from "react-router-dom";
import OrgHome from "../pages/organization/Home";
import LogPage from "../pages/organization/log/LogPage";
import OrganizationWrapper from "../pages/organization/OrganizationWrapper";
import SettingsPage from "../pages/organization/settings/SettingsPage";
import UsersPage from "../pages/organization/users/UsersPage";
import InventoryRoute from "./InventoryRoute";


export default function OrganizationRoutes() {
    return (
        <OrganizationWrapper>
            <Routes>
                <Route index element={<OrgHome />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/inventory/*" element={<InventoryRoute />} />
                <Route path="/log" element={<LogPage />} />
                <Route path="/settings" element={<SettingsPage />} />
            </Routes>
        </OrganizationWrapper>
    )
}