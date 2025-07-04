import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ContextProvider from './components/contexts/ContextProvider.js'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ContextProvider>

        <Routes>
          <Route index path='/*' element={<App />} />
        </Routes>

      </ContextProvider>
    </BrowserRouter>

  </StrictMode>
)
