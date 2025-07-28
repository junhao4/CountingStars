import "@testing-library/jest-dom"
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from "react-router-dom"
import App from "../../App";
import MockContextProvider, { type MockContextProviderProps } from "../__mocks__/MockContextProvider";

vi.mock("../../features/organization/users/api/UserGridApi", () => ({
    fetchOrganizationUsers: vi.fn().mockResolvedValue([{
        id: "Test UUID",
        name: "Test User",
        role: "owner" as const,
        imageFile: "",
        email: "Test Email",
    }]),
    addOrganizationUser: vi.fn().mockResolvedValue(true),
    updateUserRole: vi.fn().mockResolvedValue(true),
    deleteUser: vi.fn().mockResolvedValue(undefined),
    acceptPendingUser: vi.fn().mockResolvedValue(undefined),
    rejectPendingUser: vi.fn().mockResolvedValue(undefined),
}))

const renderUserPage = ({ hasSession, hasOrganization }: MockContextProviderProps) => {
    return render(
        <MemoryRouter initialEntries={['/dashboard/organization/users']}>
            <MockContextProvider hasSession={hasSession} hasOrganization={hasOrganization}>
                <App />
            </MockContextProvider>
        </MemoryRouter>
    )
}


describe("Users page renders", () => {
    it('should render sidebar, header and organization page', async () => {
        renderUserPage({ hasSession: true, hasOrganization: true })

        // Page title
        expect(await screen.findByRole('heading', { level: 2, name: /users/i })).toBeDefined()

        // Sidebar Dashboard tab + breadcrumb
        expect(screen.getByTestId("ViewListIcon")).toBeDefined()
        expect(screen.getAllByText(/dashboard/i)).toHaveLength(2)

        // Sidebar Organization tab + breadcrumb
        expect(screen.getByTestId("HomeIcon")).toBeDefined()
        expect(screen.getAllByText(/organization/i)).toHaveLength(2)

        // Sidebar Users tab
        expect(screen.getByTestId("GroupIcon")).toBeDefined()
        expect(screen.getAllByText(/users/i)).toHaveLength(3)

        // Sidebar Inventory tab
        expect(screen.getByTestId("InventoryIcon")).toBeDefined()
        expect(screen.getByText(/inventory/i)).toBeDefined()

        // Sidebar Charts tab
        expect(screen.getByTestId("TimelineIcon")).toBeDefined()
        expect(screen.getByText(/charts/i)).toBeDefined()
        // Sidebar Logs tab
        expect(screen.getByTestId("HistoryIcon")).toBeDefined()
        expect(screen.getByText(/Logs/i)).toBeDefined()

        // Sidebar Settings tab
        expect(screen.getByTestId("SettingsIcon")).toBeDefined()
        expect(screen.getByText(/settings/i)).toBeDefined()

        // Header notification bell
        expect(screen.getByLabelText(/Notifications/i)).toBeDefined()
    })

    it("should navigate to dashboard when no organization chosen", async () => {
        renderUserPage({ hasSession: true, hasOrganization: false })
        expect(await screen.findByRole('heading', { name: /dashboard/i })).toBeDefined()
    })

    it("should navigate to home when no session exists", async () => {
        renderUserPage({ hasSession: false, hasOrganization: true })
        expect(await screen.findByRole('heading', { name: /home/i })).toBeDefined()
    })
})

describe("Users page add new user form", () => {
    it("should render add user components", async () => {
        renderUserPage({hasSession: true, hasOrganization: true})

        expect(await screen.findByRole('textbox', {name: /email/i})).toBeDefined()
        expect(screen.getByRole('combobox', {name: /role/i})).toBeDefined()
        expect(screen.getByRole('button', {name: /add user/i})).toBeDefined()

        expect(await screen.findByText("User ID")).toBeDefined()
    })
})