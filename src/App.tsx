import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './components/Header.tsx'
import Home from './components/pages/Home.tsx'
import Login from './components/pages/Login.tsx'
import Register from './components/pages/Register.tsx'
import Dashboard from './components/pages/dashboard/Dashboard.tsx'
import NotFound from './components/pages/NotFound.tsx'

import supabase from './helper/supabaseClient.ts'

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

  const [pageTitle, setPageTitle] = useState("Home");

  return (
    <main>
      <div>
        <BrowserRouter>
          <Header pageTitle={pageTitle}/>
          <Routes>
            <Route index path='/' element={<Home setPageTitle={setPageTitle}/>} />
            <Route path='/login' element={<Login setPageTitle={setPageTitle}/>} />
            <Route path='/register' element={<Register setPageTitle={setPageTitle}/>} />
            <Route path='/dashboard/:userId' element={<Dashboard setPageTitle={setPageTitle} />} />
            <Route path='*' element={<NotFound />} />
          </Routes> 
        </BrowserRouter>
      </div>
    </main>
  )
}

export default App
