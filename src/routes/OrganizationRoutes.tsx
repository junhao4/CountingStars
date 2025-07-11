import { Routes, Route } from "react-router-dom";
import OrgHome from "../pages/organization/Home";
import CategoriesPage from "../pages/organization/inventory/CategoriesPage";
import InventoryPage from "../pages/organization/inventory/InventoryPage";
import InventoryAddItemPage from "../pages/organization/inventory/InventoryAddItemPage";
import LogPage from "../pages/organization/log/LogPage";
import OrganizationWrapper from "../pages/organization/OrganizationWrapper";
import SettingsPage from "../pages/organization/settings/SettingsPage";
import UsersPage from "../pages/organization/users/UsersPage";
import ItemPage from "../pages/organization/inventory/ItemPage";


export default function OrganizationRoutes() {
    return (
        <OrganizationWrapper>
            <Routes>
                <Route index element={<OrgHome />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/inventory/*"
                    element={
                        <Routes>
                            <Route index element={<InventoryPage />} />
                            <Route path='/:itemId' element={<ItemPage />} />
                            <Route path="/add" element={<InventoryAddItemPage />} />
                            <Route path="/categories" element={<CategoriesPage />} />
                        </Routes>
                    }
                />
                <Route path="/log" element={<LogPage />} />
                <Route path="/settings" element={<SettingsPage />} />
            </Routes>
        </OrganizationWrapper>
    )
}