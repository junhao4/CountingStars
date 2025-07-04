import Home from "../components/pages/Home"
import Verify from "../components/pages/auth/Verify";
import { Route, Routes } from "react-router-dom";
import AuthWrapper from "../components/pages/auth/AuthWrapper";
import ForgotPassword from "../components/pages/auth/ForgotPassword";
import { Login } from "../components/pages/auth/Login";
import { Register } from "../components/pages/auth/Register";
import ResetPassword from "../components/pages/auth/ResetPassword";
import NotFound from "../components/pages/NotFound";
import AuthenticatedRoutes from "./AuthenticatedRoutes";


export default function MainRoutes() {
    return (
        <Routes>
            <Route index path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/dashboard/*" element={<AuthWrapper><AuthenticatedRoutes /></AuthWrapper>} />
            <Route path="/forgot" element={<ForgotPassword />} />
            <Route path="/reset" element={<ResetPassword />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}