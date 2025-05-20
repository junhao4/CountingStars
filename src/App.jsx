import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import './App.css'
import Home from './components/pages/Home.jsx'
import Login from './components/pages/Login.jsx'


function App() {
  const [count, setCount] = useState(0);

  return (
    <main>
      <div>
        <BrowserRouter>
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
