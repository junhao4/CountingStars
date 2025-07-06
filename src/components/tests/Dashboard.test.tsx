import { vi, it, expect, describe, afterEach } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { fetchDashboard, transformOrgDataToDashboardCard } from "../pages/dashboard/DashboardController";
import App from "../../App";
import ContextProvider from "../contexts/ContextProvider";
import React from "react";
import { fetchOrganization, fetchOrgImage } from "../pages/organization/OrgController";
import type { Session } from "@supabase/supabase-js";
import { dummySession, dummyUser, dummyUUID, simulateMockSession, simulateNoSession, spyonSupabaseMockDataOnce } from "./testController";
import * as SessionContext from "../contexts/SessionContext"
import * as OrgController from "../pages/organization/OrgController"
import * as DashboardController from "../pages/dashboard/DashboardController"
import * as AuthController from "../pages/auth/AuthController"
import supabase from "../../helper/supabaseClient";
import userEvent from "@testing-library/user-event";

describe("FetchDashboard unit test", () => {
    afterEach(() => {
        vi.resetAllMocks()
    })

    it("should return empty array when supabase throws an error", async () => {
        vi.spyOn(OrgController, "fetchOrganization").mockResolvedValue({ id: 1, name: "Test", imageFile: "Test" })
        vi.spyOn(OrgController, "fetchOrgImage").mockResolvedValue("Image")

        const mockData = {
            data: null,
            error: { name: 'Testing Error', code: '404', hint: "", details: "", message: "" }
        }

        spyonSupabaseMockDataOnce(mockData)

        await expect(fetchDashboard(dummyUUID)).resolves.toEqual([])

    })

    it("should return empty array when input length is 0", async () => {
        vi.spyOn(OrgController, "fetchOrganization").mockResolvedValue({ id: 1, name: "Test", imageFile: "Test" })
        vi.spyOn(OrgController, "fetchOrgImage").mockResolvedValue("Image")

        const mockData = {
            data: [],
            error: null,
        }

        spyonSupabaseMockDataOnce(mockData)

        await expect(fetchDashboard(dummyUUID)).resolves.toEqual([])

        expect(fetchOrganization).toBeCalledTimes(0)

        expect(fetchOrgImage).toBeCalledTimes(0)

    })

    it("should return correct data array of length 1 when input length is 1", async () => {
        vi.spyOn(OrgController, "fetchOrganization").mockResolvedValue({ id: 1, name: "Test", imageFile: "Test" })
        vi.spyOn(OrgController, "fetchOrgImage").mockResolvedValue("Image")

        const mockData = {
            data: [{ organization_id: 1, role: 'owner' }],
            error: null
        }

        const expectedResult = [{ id: 1, name: "Test", role: "owner", imageFile: "Test", imageUrlBlob: "Image" }]

        spyonSupabaseMockDataOnce(mockData)

        await expect(fetchDashboard(dummyUUID)).resolves.toEqual(expectedResult)

        expect(fetchOrganization).toBeCalledTimes(1)

        expect(fetchOrgImage).toBeCalledTimes(1)

    })

})

describe("TransformOrgDataToDashboardCard unit test", () => {
    afterEach(() => {
        vi.resetAllMocks()
    })

    it("should return data when input valid user and organization data", async () => {
        const dummyOrganization = { id: 1, name: "Test Organization", imageFile: null }
        const expectedOutputData = { ...dummyOrganization, role: 'member', imageUrlBlob: "ImageUrl" }

        vi.spyOn(OrgController, "fetchUserRole").mockResolvedValue("member")
        vi.spyOn(OrgController, "fetchOrgImage").mockResolvedValue("ImageUrl")

        await expect(transformOrgDataToDashboardCard(dummyUUID, dummyOrganization)).resolves.toEqual(expectedOutputData)

        expect(OrgController.fetchUserRole).toBeCalledTimes(1)
        expect(OrgController.fetchUserRole).toBeCalledWith(dummyUUID, dummyOrganization.id)

        expect(OrgController.fetchOrgImage).toBeCalledTimes(1)
        expect(OrgController.fetchOrgImage).toBeCalledWith(null)
    })

    it("should return null when invalid input", async () => {
        const dummyOrganization = { id: 1, name: "Test Organization", imageFile: null }
        const expectedOutputData = null

        vi.spyOn(OrgController, "fetchUserRole").mockResolvedValue(null)
        vi.spyOn(OrgController, "fetchOrgImage").mockResolvedValue("ImageUrl")

        await expect(transformOrgDataToDashboardCard(dummyUUID, dummyOrganization)).resolves.toEqual(expectedOutputData)

        expect(OrgController.fetchUserRole).toBeCalledTimes(1)
        expect(OrgController.fetchUserRole).toBeCalledWith(dummyUUID, dummyOrganization.id)

        expect(OrgController.fetchOrgImage).toBeCalledTimes(0)
    })
})

describe("Dashboard page rendering", () => {
    afterEach(() => {
        vi.clearAllMocks()
    })

    it("should render dashboard when session exists", async () => {
        simulateMockSession()

        vi.spyOn(DashboardController, "fetchDashboard").mockResolvedValue(
            [{ id: 1, name: "Test Org", role: "pending", imageFile: null, imageUrlBlob: null }])

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

        vi.spyOn(DashboardController, "fetchDashboard").mockResolvedValue(
            [{ id: 1, name: "Test Org", role: "pending", imageFile: null, imageUrlBlob: null }])

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
        expect(screen.getByText(/Error/i)).toBeDefined()
    })
})