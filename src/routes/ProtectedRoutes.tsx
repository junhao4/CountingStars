import { Routes, Route } from "react-router-dom";
import ProfilePage from "../pages/account/ProfilePage";
import AuthWrapper from "../pages/auth/AuthWrapper";
import CreateOrg from "../pages/dashboard/DashboardCreateOrgPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import OrgHome from "../pages/organization/Home";
import OrgAddItem from "../pages/organization/inventory/InventoryAddItemPage";
import CategoriesPage from "../pages/organization/inventory/CategoriesPage";
import SettingsPage from "../pages/organization/settings/SettingsPage";
import NotificationsPage from "../pages/account/NotificationsPage";
import LogPage from "../pages/organization/log/LogPage";
import InventoryPage from "../pages/organization/inventory/InventoryPage";
import UsersPage from "../pages/organization/users/UsersPage";


export default function ProtectedRoutes() {
    return (
        <AuthWrapper>
            <Routes>
                <Route index element={<DashboardPage />} />
                <Route path="/new" element={<CreateOrg />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/organization/*"
                    element={
                        <Routes>
                            <Route index element={<OrgHome />} />
                            <Route path="/users" element={<UsersPage />} />
                            <Route
                                path="/inventory/*"
                                element={
                                    <Routes>
                                        <Route index element={<InventoryPage />} />
                                        <Route
                                            path="/add"
                                            element={<OrgAddItem />}
                                        />
                                        <Route path="/categories" element={<CategoriesPage />} />
                                    </Routes>
                                }
                            />
                            <Route path="/log" element={<LogPage />} />
                            <Route
                                path="/settings"
                                element={<SettingsPage />}
                            />
                        </Routes>
                    }
                />
            </Routes>
        </AuthWrapper>
    )
}