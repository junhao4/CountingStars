import "@testing-library/jest-dom"
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from "react-router-dom"
import App from "../../App";
import MockContextProvider, { type MockContextProviderProps } from "../__mocks__/MockContextProvider";

import "../__mocks__/MockSupabaseClient"
import userEvent from "@testing-library/user-event";

const renderOrganizationPage = ({ hasSession, hasOrganization }: MockContextProviderProps) => {
    return render(
        <MemoryRouter initialEntries={['/dashboard/organization']}>
            <MockContextProvider hasSession={hasSession} hasOrganization={hasOrganization}>
                <App />
            </MockContextProvider>
        </MemoryRouter>
    )
}


describe("Organization page renders", () => {
    it('should render sidebar, header and organization page', async () => {
        renderOrganizationPage({ hasSession: true, hasOrganization: true })

        // Page title
        expect(await screen.findByRole('heading', { level: 2, name: /Test/i })).toBeDefined()

        // Sidebar Dashboard tab + breadcrumb
        expect(screen.getByTestId("ViewListIcon")).toBeDefined()
        expect(screen.getAllByText(/dashboard/i)).toHaveLength(2)

        // Sidebar Organization tab + breadcrumb
        expect(screen.getByTestId("HomeIcon")).toBeDefined()
        expect(screen.getAllByText(/organization/i)).toHaveLength(2)

        // Sidebar Users tab
        expect(screen.getAllByTestId("GroupIcon")).toHaveLength(2)
        expect(screen.getAllByText(/users/i)).toHaveLength(3)

        // Sidebar Inventory tab
        expect(screen.getAllByTestId("InventoryIcon")).toHaveLength(2)
        expect(screen.getAllByText(/inventory/i)).toHaveLength(2)

        // Sidebar Charts tab
        expect(screen.getAllByTestId("TimelineIcon")).toHaveLength(2)
        expect(screen.getAllByText(/charts/i)).toHaveLength(2)

        // Sidebar Logs tab
        expect(screen.getAllByTestId("HistoryIcon")).toHaveLength(2)
        expect(screen.getAllByText(/Logs/i)).toHaveLength(2)

        // Sidebar Settings tab
        expect(screen.getAllByTestId("SettingsIcon")).toHaveLength(2)
        expect(screen.getAllByText(/settings/i)).toHaveLength(2)

        // Header notification bell
        expect(screen.getByLabelText(/Notifications/i)).toBeDefined()
    })

    it("should navigate to dashboard when no organization chosen", async () => {
        renderOrganizationPage({ hasSession: true, hasOrganization: false })
        expect(await screen.findByRole('heading', { name: /dashboard/i })).toBeDefined()
    })

    it("should navigate to home when no session exists", async () => {
        renderOrganizationPage({ hasSession: false, hasOrganization: true })
        expect(await screen.findByRole('heading', { name: /home/i })).toBeDefined()
    })
})

describe("Organization page buttons navigates", () => {
    it("should navigate to Users page when button is clicked", async () => {
        renderOrganizationPage({hasSession: true, hasOrganization: true})
        await userEvent.click(await screen.findByRole('button', {name: /users/i}))

        expect(await screen.findByRole('heading', {name: /users/i}))
    })

    it("should navigate to Inventory page when button is clicked", async () => {
        renderOrganizationPage({hasSession: true, hasOrganization: true})
        await userEvent.click(await screen.findByRole('button', {name: /inventory/i}))

        expect(await screen.findByRole('heading', {name: /inventory/i}))
    })
    
    it("should navigate to Charts page when button is clicked", async () => {
        renderOrganizationPage({hasSession: true, hasOrganization: true})
        await userEvent.click(await screen.findByRole('button', {name: /charts/i}))

        expect(await screen.findByRole('heading', {name: /charts/i}))
    })

    
    it("should navigate to Logs page when button is clicked", async () => {
        renderOrganizationPage({hasSession: true, hasOrganization: true})
        await userEvent.click(await screen.findByRole('button', {name: /logs/i}))

        expect(await screen.findByRole('heading', {name: 'Logs'}))
    })

    
    it("should navigate to Settings page when button is clicked", async () => {
        renderOrganizationPage({hasSession: true, hasOrganization: true})
        await userEvent.click(await screen.findByRole('button', {name: 'Settings'}))

        expect(await screen.findByRole('heading', {name: /settings/i}))
    })
})