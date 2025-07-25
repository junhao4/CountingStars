import Home from "../pages/home/HomePage"
import { Route, Routes } from "react-router-dom";
import NotFound from "../pages/NotFoundPage";
import ProtectedRoutes from "./ProtectedRoutes";
import ForgotPasswordPage from "../pages/auth/ForgetPasswordPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import VerifyPage from "../pages/auth/VerifyPage";
import ThemePage from "../pages/ThemePage";


export default function MainRoutes() {
    return (
        <Routes>
            <Route index path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify" element={<VerifyPage />} />
            <Route path="/dashboard/*" element={<ProtectedRoutes />} />
            <Route path="/forgot" element={<ForgotPasswordPage />} />
            <Route path="/reset" element={<ResetPasswordPage />} />
            <Route path="/theme" element={<ThemePage />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}