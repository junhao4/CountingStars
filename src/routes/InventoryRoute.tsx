import { Routes, Route } from "react-router-dom";
import CategoriesPage from "../pages/organization/inventory/CategoriesPage";
import InventoryFolderPage from "../pages/organization/inventory/folder/InventoryFolderPage";
import InventoryAddItemPage from "../pages/organization/inventory/InventoryAddItemPage";
import ItemPage from "../pages/organization/inventory/ItemPage";


export default function InventoryRoute() {
    return (
        <Routes>
            <Route index path='/*' element={
                <Routes>
                    <Route index path="/" element={<InventoryFolderPage />} />
                    <Route index path=":folderId" element={<InventoryFolderPage />} />
                </Routes>
            } />
            <Route path="/item/*" element={
                <Routes>
                    <Route index path='/' element={<ItemPage />} />
                    <Route path=":itemId" element={<ItemPage />} />
                </Routes>
            } />
            <Route path="/add" element={<InventoryAddItemPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
        </Routes>
    )
}