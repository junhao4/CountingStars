import "@testing-library/jest-dom"
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from "react-router-dom"
import App from "../../App";
import ContextProvider from "../contexts/ContextProvider";
import type { Session, User } from "@supabase/supabase-js";
import supabase from "../../helper/supabaseClient";
import { useSessionContext, SessionProvider } from "../contexts/SessionContext";

const renderLoginWithoutSession = () => {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <ContextProvider>
        <Routes>
          <Route index path='/*' element={<App />} />
        </Routes>
      </ContextProvider>
    </MemoryRouter>
  )
}

const dummyUser: User = {
  id: "1",
  app_metadata: {},
  user_metadata: {},
  aud: "",
  created_at: ""
}

const dummySession: Session = {
  access_token: "",
  refresh_token: "",
  expires_in: 0,
  token_type: "",
  user: dummyUser
}

// vi.spyOn(supabase.auth, "signInWithPassword")
//   .mockResolvedValueOnce({ data: { user: dummyUser, session: dummySession }, error: null })

// vi.spyOn(supabase.auth, "onAuthStateChange")
//   .mockResolvedValue({
//     data: {
//       subscription: {
//         id: '',
//         callback: (event, session) => null,
//         unsubscribe: () => null
//       }
//     }
//   })

describe("Login page test", () => {

  it('Header components exists, not logged in', () => {
    renderLoginWithoutSession()

    // Page title
    expect(screen.getByRole('heading', { level: 2, name: /Login/i })).toBeDefined()

    // Login redirect link
    expect(screen.getByTestId(/header-login-link/i)).toBeDefined()

    // Register redirect link
    expect(screen.getByTestId(/header-register-link/i)).toBeDefined()

  })

  it('Login page sidebar components exists', () => {
    renderLoginWithoutSession()

    // Home tab
    expect(screen.getByText(/home/i)).toBeDefined()

    // Dashboard tab
    expect(screen.getByText(/dashboard/i)).toBeDefined()
  })

  it('Login fields exists', async () => {
    renderLoginWithoutSession()

    expect(screen.getByLabelText(/Email:/i)).toHaveValue("")
    expect(screen.getByLabelText(/Password:/i)).toHaveValue("")

  })

  it('Login via default account', async () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <ContextProvider>
            <Routes>
              <Route index path='/*' element={<App />} />
            </Routes>
        </ContextProvider>
      </MemoryRouter>
    )

    await userEvent.type(screen.getByLabelText(/Email:/i), "countingstarsauth@gmail.com")
    expect(screen.getByLabelText(/Email:/i)).toHaveValue("countingstarsauth@gmail.com")

    await userEvent.type(screen.getByLabelText(/Password:/i), "testtest")
    expect(screen.getByLabelText(/Password:/i)).toHaveValue("testtest")



    await userEvent.click(screen.getByRole('button', { name: /Login/i }), { delay: 1000 })
    screen.logTestingPlaygroundURL()

    await waitFor(() => {
      expect(screen.getByText(/loading\.\.\./i)).toBeInTheDocument()
    })

  })

})