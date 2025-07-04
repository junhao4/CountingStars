import { Routes, Route } from "react-router-dom";
import Notifications from "../components/pages/account/Notifications";
import Profile from "../components/pages/account/Profile";
import CreateOrg from "../components/pages/dashboard/CreateOrg";
import Dashboard from "../components/pages/dashboard/Dashboard";
import OrgCategories from "../components/pages/organization/categories/Categories";
import OrgHome from "../components/pages/organization/Home";
import OrgAddItem from "../components/pages/organization/inventory/AddItem";
import OrgInventory from "../components/pages/organization/inventory/Inventory";
import OrgLog from "../components/pages/organization/Log";
import OrgSettings from "../components/pages/organization/settings/Settings";
import OrgUsers from "../components/pages/organization/users/Users";


export default function AuthenticatedRoutes() {
    return (
        <Routes>
            <Route index element={<Dashboard />} />
            <Route path="/new" element={<CreateOrg />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
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
    )
}