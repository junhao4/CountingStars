import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header.tsx'
import './App.css'
import Home from './components/pages/Home.tsx'
import Login from './components/pages/Login.tsx'

function App() {
  const [count, setCount] = useState(0);

  return (
    <main>
      <div>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route index path='/' element={<Home />}></Route>
            <Route path='/login' element={<Login />}></Route>
          </Routes> 
        </BrowserRouter>
      </div>
    </main>
  )
}

export default App
