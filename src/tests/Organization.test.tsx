import { afterEach, describe, expect, it, vi } from "vitest";
import * as SessionContext from "../common/contexts/SessionContext"
import * as OrgController from "../features/organization/home/api/HomeApi"
import * as DashboardController from "../features/dashboard/api/DashboardApi"
import * as AuthController from "../features/authentication/api/AuthApi"
import { dummyUUID } from "./testApi";
import type { PostgrestError } from "@supabase/supabase-js";
import type { PostgrestResponseFailure } from "@supabase/postgrest-js";
import supabase from "../helper/supabaseClient";

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