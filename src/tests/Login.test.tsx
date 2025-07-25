import "@testing-library/jest-dom"
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest'
import { MemoryRouter, Route, Routes } from "react-router-dom"
import App from "../App";
import ContextProvider from "../common/contexts/ContextProvider";
import { OrgContext } from "../common/contexts/OrgContext";
import { SessionContext } from "../common/contexts/SessionContext";

const renderLoginWithoutSession = async () => {
  return await render(
    <MemoryRouter initialEntries={['/login']}>
      <ContextProvider>
        <SessionContext.Provider value={{ session: null, user: null, setUser: () => { }, loading: false }}>
          <OrgContext.Provider value={{ org: null, setOrg: () => {}, loading: false }} >
            <Routes>
              <Route index path='/*' element={<App />} />
            </Routes>
          </OrgContext.Provider>
        </SessionContext.Provider>
      </ContextProvider>
    </MemoryRouter >
  )
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

  it('Header components exists, not logged in', async () => {
    await act(async () => {
      await renderLoginWithoutSession()
    })

    // Page title
    expect(screen.getByRole('heading', { level: 2, name: /Login/i })).toBeDefined()

    // Login redirect link
    expect(screen.getByTestId(/header-login-link/i)).toBeDefined()

    // Register redirect link
    expect(screen.getByTestId(/header-register-link/i)).toBeDefined()

  })

  it('Login page sidebar components exists', async () => {
    await act(async () => {
      await renderLoginWithoutSession()
    })

    // Home tab
    expect(screen.getByText(/home/i)).toBeDefined()

    // Dashboard tab
    expect(screen.getByText(/dashboard/i)).toBeDefined()
  })

  it('Login fields exists', async () => {
    await act(async () => {
      await renderLoginWithoutSession()
    })

    expect(screen.getByLabelText(/Email:/i)).toHaveValue("")
    expect(screen.getByLabelText(/Password:/i)).toHaveValue("")

  })
})