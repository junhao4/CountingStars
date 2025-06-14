import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import './App.css'
import Header from './components/Header.tsx'
import Home from './components/pages/Home.tsx'
import Dashboard from './components/pages/dashboard/Dashboard.tsx'
import NotFound from './components/pages/NotFound.tsx'
import { PageTitleProvider } from './components/contexts/PageTitleContext.tsx'
import { SessionProvider } from './components/contexts/SessionContext.tsx'
import Auth from './components/pages/auth/Auth.tsx'
import AuthWrapper from './components/pages/auth/AuthWrapper.tsx'
import ResetPassword from './components/pages/auth/ResetPassword.tsx'
import ForgotPassword from './components/pages/auth/ForgotPassword.tsx'
import Profile from './components/pages/Profile.tsx'
import OrgHome from './components/pages/organization/Home.tsx'
import { OrgProvider } from './components/contexts/OrgContext.tsx'
import OrgInventory from './components/pages/organization/inventory/Inventory.tsx'
import OrgUsers from './components/pages/organization/Users.tsx';



function App() {
  return (
    <main>
      <div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <SessionProvider>
            <OrgProvider>
              <PageTitleProvider>
                <BrowserRouter>
                  <Header />
                  <Routes>
                    <Route index path='/' element={<Home />} />
                    <Route path='/login' element={<Auth state='login' />} />
                    <Route path='/register' element={<Auth state='register' />} />
                    <Route path='/dashboard/*' element={
                      <AuthWrapper>
                        <Routes>
                          <Route index element={<Dashboard />} />
                          <Route path='/profile' element={<Profile />} />
                          <Route path='/organization/*' element={
                            <Routes>
                              <Route index element={<OrgHome />} />
                              <Route path='/users' element={<OrgUsers />} />
                              <Route path='/inventory' element={<OrgInventory />} />
                            </Routes>
                          } />
                        </Routes>
                      </AuthWrapper>
                    } />
                    <Route path='/forgot' element={<ForgotPassword />} />
                    <Route path='/reset' element={<ResetPassword />} />
                    <Route path='*' element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </PageTitleProvider>
            </OrgProvider>
          </SessionProvider>
        </LocalizationProvider>
      </div>
    </main >
  )
}

export default App
