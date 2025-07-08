import { Routes, Route } from "react-router-dom";
import ProfilePage from "../pages/account/ProfilePage";
import AuthWrapper from "../pages/auth/AuthWrapper";
import CreateOrg from "../pages/dashboard/DashboardCreateOrgPage";
import Dashboard from "../features/dashboard/components/Dashboard";
import OrgHome from "../pages/organization/Home";
import OrgAddItem from "../pages/organization/inventory/AddItem";
import OrgCategories from "../pages/organization/inventory/Categories";
import OrgInventory from "../features/organization/inventory/components/Inventory";
import OrgLog from "../pages/organization/log/Log";
import OrgSettings from "../pages/organization/settings/Settings";
import OrgUsers from "../pages/organization/users/Users";
import NotificationsPage from "../pages/account/NotificationsPage";


export default function ProtectedRoutes() {
    return (
        <AuthWrapper>
            <Routes>
                <Route index element={<Dashboard />} />
                <Route path="/new" element={<CreateOrg />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/organization/*"
                    element={
                        <Routes>
                            <Route index element={<OrgHome />} />
                            <Route path="/users" element={<OrgUsers />} />
                            <Route
                                path="/inventory/*"
                                element={
                                    <Routes>
                                        <Route index element={<OrgInventory />} />
                                        <Route
                                            path="/add"
                                            element={<OrgAddItem />}
                                        />
                                        <Route path="/categories" element={<OrgCategories />} />
                                    </Routes>
                                }
                            />
                            <Route path="/log" element={<OrgLog />} />
                            <Route
                                path="/settings"
                                element={<OrgSettings />}
                            />
                        </Routes>
                    }
                />
            </Routes>
        </AuthWrapper>
    )
}