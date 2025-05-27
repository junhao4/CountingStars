import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './components/Header.tsx'
import Home from './components/pages/Home.tsx'
import Dashboard from './components/pages/dashboard/Dashboard.tsx'
import NotFound from './components/pages/NotFound.tsx'
import { PageTitleProvider } from './components/contexts/PageTitleContext.tsx'
import { SessionProvider } from './components/contexts/SessionContext.tsx'
import supabase from './helper/supabaseClient.ts'
import Auth from './components/pages/Auth.tsx'
import AuthWrapper from './components/AuthWrapper.tsx'



function App() {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    console.log(event, session)
    if (event === 'INITIAL_SESSION') {
      // handle initial session
    } else if (event === 'SIGNED_IN') {
      // handle sign in event
    } else if (event === 'SIGNED_OUT') {
      // handle sign out event
    } else if (event === 'PASSWORD_RECOVERY') {
      // handle password recovery event
    } else if (event === 'TOKEN_REFRESHED') {
      // handle token refreshed event
    } else if (event === 'USER_UPDATED') {
      // handle user updated event
    }
  })

  // call unsubscribe to remove the callback
  data.subscription.unsubscribe();

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
