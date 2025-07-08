import Home from "../pages/Home"
import { Route, Routes } from "react-router-dom";
import NotFound from "../pages/NotFound";
import ProtectedRoutes from "./ProtectedRoutes";
import ForgotPasswordPage from "../pages/auth/ForgetPasswordPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import VerifyPage from "../pages/auth/VerifyPage";


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
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}