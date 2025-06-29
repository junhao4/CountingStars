import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/overlays/Header.tsx";
import Home from "./components/pages/Home.tsx";
import Dashboard from "./components/pages/dashboard/Dashboard.tsx";
import NotFound from "./components/pages/NotFound.tsx";
import AuthWrapper from "./components/pages/auth/AuthWrapper.tsx";
import ResetPassword from "./components/pages/auth/ResetPassword.tsx";
import ForgotPassword from "./components/pages/auth/ForgotPassword.tsx";
import Profile from "./components/pages/account/Profile.tsx";
import OrgHome from "./components/pages/organization/Home.tsx";
import OrgInventory from "./components/pages/organization/inventory/Inventory.tsx";
import OrgUsers from "./components/pages/organization/users/Users.tsx";
import { Login } from "./components/pages/auth/Login.tsx";
import { Register } from "./components/pages/auth/Register.tsx";
import Message from "./components/overlays/Message.tsx";
import ContextProvider from "./components/contexts/ContextProvider.tsx";
import OrgSettings from "./components/pages/organization/settings/Settings.tsx";
import Notifications from "./components/pages/account/Notifications.tsx";
import Verify from "./components/pages/auth/Verify.tsx";
import CreateOrg from "./components/pages/dashboard/CreateOrg.tsx";
import OrgAddItem from "./components/pages/organization/inventory/AddItem.tsx";
import OrgLog from "./components/pages/organization/log/Log.tsx";
import Sidebar from "./components/overlays/Sidebar.tsx";

function App() {
  return (
    <main>
      <div>
        <ContextProvider>
          <BrowserRouter>
            <Header />
            <Message />
            <div className='app-div' >
              <Sidebar />
              <Routes>
                <Route index path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify" element={<Verify />} />

                <Route
                  path="/dashboard/*"
                  element={
                    <AuthWrapper>
                      <Routes>
                        <Route index element={<Dashboard />} />
                        <Route path="/new" element={<CreateOrg />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route
                          path="/notifications"
                          element={<Notifications />}
                        />
                        <Route
                          path="/organization/*"
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
                  }
                />
                <Route path="/forgot" element={<ForgotPassword />} />
                <Route path="/reset" element={<ResetPassword />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </ContextProvider>
      </div>
    </main>
  );
}

export default App;
