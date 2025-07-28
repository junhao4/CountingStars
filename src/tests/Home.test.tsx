import "@testing-library/jest-dom"
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from "react-router-dom"
import App from "../App";
import { dummySession } from "./testApi";
import MockContextProvider from "./__mocks__/MockContextProvider";

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


const renderHomePage = () => {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <MockContextProvider>
        <App />
      </MockContextProvider>
    </MemoryRouter>
  )
}

describe("Home page renders", () => {
  it('should render header and sidebar', async () => {
    renderHomePage()

    // Page title
    expect(screen.getByRole('heading', { level: 2, name: /Home/i })).toBeDefined()

    // Sidebar Home tab
    expect(screen.getByTestId('HomeIcon')).toBeDefined()
    expect(screen.getAllByText(/home/i)).toHaveLength(2)

    // Sidebar Dashboard tab
    expect(screen.getByTestId('ViewListIcon')).toBeDefined()
    expect(screen.getByText(/dashboard/i)).toBeDefined()

    // Header Login redirect link
    expect(screen.getByTestId(/header-login-link/i)).toBeDefined()

    // Header Register redirect link
    expect(screen.getByTestId(/header-register-link/i)).toBeDefined()
  })

  it('should render home page', async () => {
    renderHomePage()

    expect(screen.getAllByRole('img')).toBeDefined()
  })
})