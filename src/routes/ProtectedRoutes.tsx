import { Routes, Route } from "react-router-dom";
import ProfilePage from "../pages/account/ProfilePage";
import SessionWrapper from "../pages/auth/SessionWrapper";
import CreateOrg from "../pages/dashboard/DashboardCreateOrgPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import NotificationsPage from "../pages/account/NotificationsPage";
import OrganizationRoutes from "./OrganizationRoutes";


export default function ProtectedRoutes() {
    return (
        <SessionWrapper>
            <Routes>
                <Route index element={<DashboardPage />} />
                <Route path="/new" element={<CreateOrg />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/organization/*" element={<OrganizationRoutes />} />
            </Routes>
        </SessionWrapper>
    )
}