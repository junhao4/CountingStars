import "@testing-library/jest-dom"
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from "react-router-dom"
import App from "../App";
import userEvent from "@testing-library/user-event";
import { dummySession, dummyUser } from "./testApi";
import MockContextProvider, { type MockContextProviderProps } from "./__mocks__/MockContextProvider";

URL.createObjectURL = vi.fn()
vi.mocked(URL.createObjectURL).mockReturnValue("Url")

// Change the mock return values in the individual tests to change the mock supabase results
const mocks = vi.hoisted(() => {
  return {
    data: vi.fn().mockReturnValue([]),
    error: vi.fn().mockReturnValue(null),
    session: vi.fn().mockImplementation(() => {
      return {
        session: null, user: null, setUser: () => { }, loading: false
      }
    })
  }
})

// Mocks the supabase client. Add on more functions if needed
vi.mock("@supabase/supabase-js", () => {
  const createClient = {
    createClient: vi.fn(() => ({
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({ data: { session: mocks.session().session, user: mocks.session().user }, error: null }),
        onAuthStateChange: vi.fn().mockImplementation(() => {
          mocks.session.mockReturnValue(dummySession)
        }),
        getSession: vi.fn().mockImplementation(() => Promise.resolve(({ data: { session: mocks.session() }, error: null })))
      },
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockReturnThis(),
          single: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          data: mocks.data(),
          error: mocks.error()
        })
        ),
      })),
      storage: {
        from: vi.fn(() => ({
          download: vi.fn().mockResolvedValue({ data: mocks.data(), error: mocks.error() })
        }))
      }
    }))
  }
  return createClient
});


const renderRegisterPage = ({hasSession}: MockContextProviderProps) => {
  return render(
    <MemoryRouter initialEntries={['/register']}>
      <MockContextProvider hasSession={hasSession}>
        <App />
      </MockContextProvider>
    </MemoryRouter>
  )
}

describe("Register page renders", () => {
  it('should render header and sidebar', async () => {
    renderRegisterPage({hasSession: false})

    // Page title
    expect(screen.getByRole('heading', { level: 2, name: /Registration/i })).toBeDefined()

    // Sidebar Home tab
    expect(screen.getByText(/home/i)).toBeDefined()

    // Sidebar Dashboard tab
    expect(screen.getByText(/dashboard/i)).toBeDefined()

    // Header Login redirect link
    expect(screen.getByTestId(/header-login-link/i)).toBeDefined()

    // Header Register redirect link
    expect(screen.getByTestId(/header-register-link/i)).toBeDefined()
  })

  it('should render registration form when not logged in', async () => {
    renderRegisterPage({hasSession: false})

    // Login fields are empty
    expect(screen.getByLabelText(/Email:/i)).toHaveValue("")
    expect(screen.getByLabelText(/Password:/i)).toHaveValue("")
    expect(screen.getByRole('button', {name:/Register/i})).toBeInTheDocument()

    await userEvent.type(screen.getByLabelText(/Email:/i), "fakeemail@fakemail.com")
    expect(screen.getByLabelText(/Email:/i)).toHaveValue("fakeemail@fakemail.com")

    await userEvent.type(screen.getByLabelText(/Password:/i), "password")
    expect(screen.getByLabelText(/Password:/i)).toHaveValue("password")
  })

    it("should navigate away to dashboard when already logged in", async () => {
    mocks.session.mockImplementation(() => ({
      session: dummySession, user: dummyUser, setUser: () => { }, loading: false
    }))

    renderRegisterPage({hasSession: true})

    expect(await screen.findByRole('heading', { name: /Dashboard/i, level: 2 })).toBeInTheDocument()
  })
})