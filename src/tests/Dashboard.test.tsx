import { vi, it, expect, describe, afterEach } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import ContextProvider from "../common/contexts/ContextProvider";
import { fetchOrganization, fetchOrgImage } from "../features/organization/home/api/HomeApi";
import { dummyUUID, simulateMockSession, simulateNoSession } from "./testApi";
import * as SessionContext from "../common/contexts/SessionContext"
import * as OrgController from "../features/organization/home/api/HomeApi"
import * as DashboardController from "../features/dashboard/api/DashboardApi"
import * as AuthController from "../features/authentication/api/AuthApi"
import * as AccountMenuController from "../common/api/UserApi"
import userEvent from "@testing-library/user-event";
import { fetchDashboard, transformOrgDataToDashboardCard } from "../features/dashboard/api/DashboardApi";
import type { Organization } from "../helper/types";

URL.createObjectURL = vi.fn()
vi.mocked(URL.createObjectURL).mockReturnValue("Url")

// Change the mock return values in the individual tests to change the mock supabase results
const mocks = vi.hoisted(() => {
    return {
        data: vi.fn(),
        error: vi.fn()
    }
})

// Mocks the supabase client. Add on more functions if needed
vi.mock("@supabase/supabase-js", () => {
    const createClient = {
        createClient: vi.fn(() => ({
            auth: {
                signInWithPassword: vi.fn().mockResolvedValue({ data: { session: {} }, error: null }),
                onAuthStateChange: vi.fn()
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

describe("FetchDashboard unit test", () => {
    afterEach(() => {
        vi.resetAllMocks()
    })

    it("should return empty array when supabase throws an error", async () => {
        vi.spyOn(OrgController, "fetchOrganization").mockResolvedValue({ id: 1, name: "Test", imageFile: "Test" })
        vi.spyOn(OrgController, "fetchOrgImage").mockResolvedValue("Image")

        const mockSupabaseData = {
            data: null,
            error: { name: 'Testing Error', code: '404', hint: "", details: "", message: "" }
        }

        mocks.data.mockReturnValue(mockSupabaseData.data)
        mocks.error.mockReturnValue(mockSupabaseData.error)

        await expect(fetchDashboard(dummyUUID)).resolves.toEqual([])

    })

    it("should return empty array when input length is 0", async () => {
        vi.spyOn(OrgController, "fetchOrganization").mockResolvedValue({ id: 1, name: "Test", imageFile: "Test" })
        vi.spyOn(OrgController, "fetchOrgImage").mockResolvedValue("Image")

        const mockSupabaseData = {
            data: [],
            error: null,
        }
        mocks.data.mockReturnValue(mockSupabaseData.data)
        mocks.error.mockReturnValue(mockSupabaseData.error)

        await expect(fetchDashboard(dummyUUID)).resolves.toEqual([])

        expect(fetchOrganization).toBeCalledTimes(0)

        expect(fetchOrgImage).toBeCalledTimes(0)

    })

    it("should return correct data array of length 1 when input length is 1", async () => {
        vi.spyOn(OrgController, "fetchOrganization").mockResolvedValue({ id: 1, name: "Test", imageFile: "Test" })
        vi.spyOn(OrgController, "fetchOrgImage").mockResolvedValue("Image")

        const mockSupabaseData = {
            data: [{ organization_id: 1, role: 'owner' }],
            error: null
        }

        mocks.data.mockReturnValue(mockSupabaseData.data)
        mocks.error.mockReturnValue(mockSupabaseData.error)

        const expectedResult = [{ id: 1, name: "Test", role: "owner", imageFile: "Test", imageUrlBlob: "Image" }]

        await expect(fetchDashboard(dummyUUID)).resolves.toEqual(expectedResult)

        expect(fetchOrganization).toBeCalledTimes(1)

        expect(fetchOrgImage).toBeCalledTimes(1)

    })

})

describe("Dashboard page rendering", () => {
    afterEach(() => {
        vi.clearAllMocks()
    })

    it("should render dashboard when session exists", async () => {
        simulateMockSession()

        vi.spyOn(AccountMenuController, "fetchProfileImage").mockResolvedValue(null)

        vi.spyOn(DashboardController, "fetchDashboard").mockResolvedValue(
            [{ id: 1, name: "Test Org", role: "pending", imageFile: "TEST", imageUrlBlob: null }])

        await act(async () => {
            render(
                <MemoryRouter initialEntries={['/dashboard']}>
                    <ContextProvider>
                        <App />
                    </ContextProvider>
                </MemoryRouter>)
        })

        expect(screen.getByRole('button', { name: /Create Organization/i })).toBeDefined()
        expect(screen.getByRole('button', { name: /join organization/i })).toBeDefined()
        expect(screen.getAllByRole('button', { name: /enter/i })).toHaveLength(1)
        expect(screen.getByRole('button', { name: /enter/i })).toBeDefined()
    })

    it("should navigate to home page when no session exists", async () => {
        simulateNoSession()

        await act(async () => {
            render(
                <MemoryRouter initialEntries={['/dashboard']}>
                    <ContextProvider>
                        <App />
                    </ContextProvider>
                </MemoryRouter>)
        })

        expect(screen.getByRole('heading', { name: /Home/i, level: 2 })).toBeDefined()
    })

    it("should show alert when entering organization button is clicked with pending role", async () => {
        simulateMockSession()

        vi.spyOn(AccountMenuController, "fetchProfileImage").mockResolvedValue(null)

        vi.spyOn(DashboardController, "fetchDashboard").mockResolvedValue(
            [{ id: 1, name: "Test Org", role: "pending", imageFile: "TEST", imageUrlBlob: null }])

        await act(async () => {
            render(
                <MemoryRouter initialEntries={['/dashboard']}>
                    <ContextProvider>
                        <App />
                    </ContextProvider>
                </MemoryRouter>)
        })

        await act(async () => {
            await userEvent.click(screen.getByRole('button', { name: /enter/i }))
        })

        expect(screen.getByRole('heading', { name: /Dashboard/i })).toBeDefined()
        expect(screen.getByText(/Warning/i)).toBeDefined()
    })
})