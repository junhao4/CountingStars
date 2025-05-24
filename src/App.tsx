import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header.tsx'
import './App.css'
import Home from './components/pages/Home.tsx'
import Login from './components/pages/Login.tsx'
import Register from './components/pages/Register.tsx'
import NotFound from './components/pages/NotFound.tsx'
import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js'
import supabase from './helper/supabaseClient.ts'

function App() {
  // Create a single supabase client for interacting with your database
  const [user, setUser] = useState<User | null>(null);
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    console.log(event, session)
    setUser(session?.user || null);
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
          <Header pageTitle={pageTitle} user={user || null} handleUserLogout={() => {setUser(null);}}/>
          <Routes>
            <Route index path='/' element={<Home setPageTitle={setPageTitle}/>}></Route>
            <Route path='/login' element={<Login setPageTitle={setPageTitle}/>}></Route>
            <Route path='/register' element={<Register setPageTitle={setPageTitle}/>}></Route>
            <Route path='*' element={<NotFound />}></Route>
          </Routes> 
        </BrowserRouter>
      </div>
    </main>
  )
}

export default App
