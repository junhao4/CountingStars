import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './components/Header.tsx'
import Home from './components/pages/Home.tsx'
import Dashboard from './components/pages/dashboard/Dashboard.tsx'
import NotFound from './components/pages/NotFound.tsx'
import { PageTitleProvider } from './components/contexts/PageTitleContext.tsx'
import { SessionProvider } from './components/contexts/SessionContext.tsx'
import Auth from './components/pages/Auth.tsx'
import AuthWrapper from './components/AuthWrapper.tsx'
import ResetPassword from './components/pages/ResetPassword.tsx'
import ForgotPassword from './components/pages/ForgotPassword.tsx'



function App() {
  return (
    <main>
      <div>
        <SessionProvider>
        <PageTitleProvider>
          <BrowserRouter>
            <Header />
            <Routes>
              <Route index path='/' element={<Home />} />
              <Route path='/login' element={
                  <Auth state='login' />
              } />

              <Route path='/register' element={
                  <Auth state='register' />
              } />
                <Route path='/dashboard' element={ 
                  <AuthWrapper>
                     <Dashboard /> 
                  </AuthWrapper>
              } />
              <Route path='/forgot' element={<ForgotPassword />} />
              <Route path='/reset' element={<ResetPassword />} />
              <Route path='*' element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </PageTitleProvider>
        </SessionProvider>
      </div>
    </main>
  )
}

export default App
