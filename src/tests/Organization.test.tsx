import { afterEach, describe, expect, it, vi } from "vitest";
import * as SessionContext from "../../common/contexts/SessionContext"
import * as OrgController from "../pages/organization/OrgController"
import * as DashboardController from "../pages/dashboard/DashboardController"
import * as AuthController from "../features/authentication/api/AuthApi"
import { dummyUUID } from "./testController";
import type { PostgrestError } from "@supabase/supabase-js";
import type { PostgrestResponseFailure } from "@supabase/postgrest-js";
import supabase from "../../helper/supabaseClient";

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

describe("fetchOrganization unit tests", () => {
    afterEach(() => {
        vi.resetAllMocks()
    })

    it("should return organization when fetch resolves", async () => {
        const dummyOrganizationId = 1;
        const mockSupabaseData = {
            data: {
                id: 1,
                name: "Test",
                imageFile: null
            },
            error: null
        }

        mocks.data.mockReturnValue(mockSupabaseData.data)
        mocks.error.mockReturnValue(mockSupabaseData.error)

        const expectedResult = mockSupabaseData.data

        await expect(OrgController.fetchOrganization(dummyOrganizationId)).resolves.toEqual(expectedResult)
    })

    it("should return null when fetch rejects", async () => {
        const dummyOrganizationId = 1
        const mockSupabaseData = {
            data: null,
            error: { name: "Test Error", message: "Test Error", code: "", details: "", hint: "" }
        }

        mocks.data.mockReturnValue(mockSupabaseData.data)
        mocks.error.mockReturnValue(mockSupabaseData.error)

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

        mocks.data.mockReturnValue(mockSupabaseData.data)
        mocks.error.mockReturnValue(mockSupabaseData.error)

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

        mocks.data.mockReturnValue(mockSupabaseData.data)
        mocks.error.mockReturnValue(mockSupabaseData.error)

        await expect(OrgController.fetchUserRole(dummyUUID, dummyOrganization.id)).rejects.toThrowError("Invalid role")
    })

    it("should handle error when supabase throws one", async () => {
        const dummyOrganization = { id: 1, name: "Test Organization", imageFile: null }
        const mockSupabaseData = {
            data: null,
            error: { name: "Test Error", message: "Test Error", code: "", details: "", hint: "" },
        }

        mocks.data.mockReturnValue(mockSupabaseData.data)
        mocks.error.mockReturnValue(mockSupabaseData.error)

        await expect(OrgController.fetchUserRole(dummyUUID, dummyOrganization.id)).resolves.toEqual(null)
    })

})

describe("fetchOrgImage unit tests", () => {
    afterEach(() => {
        vi.resetAllMocks()
    })

    // STUCK HERE: UNABLE TO MOCK STORAGE

    it("should download and return object URL for default image when input null", async () => {
        const mockSupabaseData = {
            data: new Blob(),
            error: null
        }

        mocks.data.mockReturnValue(mockSupabaseData.data)
        mocks.error.mockReturnValue(mockSupabaseData.error)

        global.URL.createObjectURL = vi.fn()
        vi.spyOn(global.URL, "createObjectURL").mockReturnValue("URL")


        await expect(OrgController.fetchOrgImage(null)).resolves.toEqual("URL")
    })
})