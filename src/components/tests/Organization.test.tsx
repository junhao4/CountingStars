import { afterEach, describe, expect, it, vi } from "vitest";
import * as SessionContext from "../contexts/SessionContext"
import * as OrgController from "../pages/organization/OrgController"
import * as DashboardController from "../pages/dashboard/DashboardController"
import * as AuthController from "../pages/auth/AuthController"
import { dummyUUID, spyonSupabaseMockDataOnce } from "./testController";
import type { PostgrestError } from "@supabase/supabase-js";
import type { PostgrestResponseFailure } from "@supabase/postgrest-js";
import supabase from "../../helper/supabaseClient";

describe("fetchOrganization unit tests", () => {
    afterEach(() => {
        vi.resetAllMocks()
    })

    it("should return organization when fetch resolves", async () => {
        const dummyOrganizationId = 1
        const mockSupabaseData = {
            data: {
                id: dummyOrganizationId,
                name: "Test",
                imageFile: null
            },
            error: null
        }
        const expectedResult = mockSupabaseData.data

        spyonSupabaseMockDataOnce(mockSupabaseData)

        await expect(OrgController.fetchOrganization(dummyOrganizationId)).resolves.toEqual(expectedResult)
    })

    it("should return null when fetch rejects", async () => {
        const dummyOrganizationId = 1
        const mockSupabaseData = {
            data: null,
            error: { name: "Test Error", message: "Test Error", code: "", details: "", hint: "" }
        }

        spyonSupabaseMockDataOnce(mockSupabaseData)

        await expect(OrgController.fetchOrganization(dummyOrganizationId)).resolves.toEqual(null)
    })
})

describe("fetchUserRole unit tests", () => {
    afterEach(() => {
        vi.resetAllMocks()
    })

    it("should return role 'owner' when fetching from supabase", async () => {
        const dummyOrganization = { id: 1, name: "Test Organization", imageFile: null }
        const mockSupabaseData = {
            data: {
                role: "owner"
            },
            error: null
        }

        spyonSupabaseMockDataOnce(mockSupabaseData)

        await expect(OrgController.fetchUserRole(dummyUUID, dummyOrganization.id)).resolves.toEqual("owner")
    })

    it("should throw an error when fetched role is not a valid role in OrganizationRoles", async () => {
        const dummyOrganization = { id: 1, name: "Test Organization", imageFile: null }
        const mockSupabaseData = {
            data: {
                role: "invalid"
            },
            error: null
        }

        spyonSupabaseMockDataOnce(mockSupabaseData)

        await expect(OrgController.fetchUserRole(dummyUUID, dummyOrganization.id)).rejects.toThrowError("Invalid role")
    })

    it("should handle error when supabase throws one", async () => {
        const dummyOrganization = { id: 1, name: "Test Organization", imageFile: null }
        const mockSupabaseData = {
            data: null,
            error: { name: "Test Error", message: "Test Error", code: "", details: "", hint: "" },
        }

        spyonSupabaseMockDataOnce(mockSupabaseData)

        await expect(OrgController.fetchUserRole(dummyUUID, dummyOrganization.id)).resolves.toEqual(null)
    })

})

describe("fetchOrgImage unit tests", () => {
    afterEach(() => {
        vi.resetAllMocks()
    })

    // STUCK HERE: UNABLE TO MOCK STORAGE

    // it("should download and return object URL for default image when input null", async () => {
    //     const mockSupabaseData = {
    //         data: new Blob(),
    //         error: null
    //     }

    //     spyonSupabaseStorageOnce(mockSupabaseData)

    //     global.URL.createObjectURL = vi.fn()
    //     vi.spyOn(global.URL, "createObjectURL").mockReturnValue("URL")


    //     await expect(OrgController.fetchOrgImage(null)).resolves.toEqual("URL")
    // })
})