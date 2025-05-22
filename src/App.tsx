import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header.tsx'
import './App.css'
<<<<<<< HEAD:src/App.jsx
import Home from './components/pages/Home.jsx'
import Login from './components/pages/Login.jsx'
import NotFound from './components/pages/NotFound.jsx'

=======
import Home from './components/pages/Home.tsx'
import Login from './components/pages/Login.tsx'
>>>>>>> feature-login:src/App.tsx

function App() {
  const [count, setCount] = useState(0);

  return (
    <main>
      <div>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route index path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </main>
  )
}

export default App
