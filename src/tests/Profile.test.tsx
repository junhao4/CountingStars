import "@testing-library/jest-dom"
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from "react-router-dom"
import App from "../App";
import MockContextProvider, { type MockContextProviderProps } from "./__mocks__/MockContextProvider";
import userEvent from "@testing-library/user-event";

import "./__mocks__/MockSupabaseClient"


vi.mock("../features/profile/api/ProfileApi", () => ({
  fetchProfileImage: vi.fn().mockResolvedValue(null),
  downloadProfileImage: vi.fn().mockResolvedValue(new Blob()),
  updateProfileName: vi.fn().mockResolvedValue(undefined),
  updateProfileImage: vi.fn().mockResolvedValue("")
}))


vi.mock("../common/api/UserApi", () => ({
  fetchUser: vi.fn().mockResolvedValue({
    id: "7a4af5c3-6640-45c3-94a7-d34bd6fbde02", name: "Test", theme: "", imageFile: "", email: "", createdAt: "",
    accent: "", base: "", created_at: "", profile_image: "", image_file: "", user_id: ""
  }),
  fetchProfileImage: vi.fn().mockResolvedValue(""),
  downloadProfileImage: vi.fn().mockResolvedValue(new Blob()),
  handleFirstTimeUser: vi.fn().mockResolvedValue(null)
}))


const renderProfilePage = ({ hasSession }: MockContextProviderProps) => {
  return render(
    <MemoryRouter initialEntries={['/dashboard/profile']}>
      <MockContextProvider hasSession={hasSession}>
        <App />
      </MockContextProvider>
    </MemoryRouter>
  )
}

describe("Profile page renders", () => {
  it('should render header and sidebar', async () => {
    renderProfilePage({ hasSession: true })

    // Page title
    expect(await screen.findByRole('heading', { level: 2, name: /Profile/i })).toBeDefined()

    // Sidebar Home tab
    expect(screen.getByTestId("HomeIcon")).toBeDefined()
    expect(screen.getByText(/home/i)).toBeDefined()

    // Sidebar Dashboard tab + breadcrumb
    expect(screen.getByTestId("ViewListIcon")).toBeDefined()
    expect(screen.getAllByText(/dashboard/i)).toHaveLength(2)

    // Header notification bell
    expect(screen.getByLabelText(/Notifications/i)).toBeDefined()
  })

  it('should render profile page', async () => {
    renderProfilePage({ hasSession: true })

    expect(await screen.findAllByRole('img')).toHaveLength(5)
    expect(screen.getByRole('heading', {level: 6, name: /Profile Information/i})).toBeDefined()
    expect(screen.getByRole('button', {name: /Upload Profile Image/i})).toBeDefined()

    expect(screen.getByRole('heading', {level: 6, name: /Username/i})).toBeDefined()
    expect(screen.getByRole('textbox')).toBeDefined()
    expect(screen.getByRole('button', {name: /Save/i})).toBeDefined()

    expect(screen.getByRole('heading', {level: 6, name: /Theme/i})).toBeDefined()
    expect(screen.getByRole('img', {name: /light/i})).toBeDefined()

    // When custom theme is clicked, the custom color selection box should appear
    await userEvent.click(screen.getByRole('img', {name:/custom/i}))
    expect(screen.getByRole('heading', { name: /custom theme colours/i })).toBeDefined()
  })
})