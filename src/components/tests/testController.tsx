import { vi, type Mock } from "vitest"
import supabase from "../../helper/supabaseClient"
import type { PostgrestResponseFailure, PostgrestResponseSuccess } from "@supabase/postgrest-js"
import type { Session } from "@supabase/supabase-js"
import * as SessionContext from "../contexts/SessionContext"
import * as OrgController from "../pages/organization/OrgController"
import * as DashboardController from "../pages/dashboard/DashboardController"
import * as AuthController from "../pages/auth/AuthController"

export const dummyUUID = "7a4af5c3-6640-45c3-94a7-d34bd6fbde02"
export const dummyUser = { user_id: dummyUUID, name: "Test", image_file: "", email: "", created_at: "" }
export const dummySession: Session = {
    access_token: "",
    refresh_token: "",
    expires_in: 0,
    token_type: "",
    user: {
        id: dummyUUID,
        app_metadata: {},
        user_metadata: {},
        aud: "",
        created_at: ""
    }
}


export const simulateNoSession = () => {
    vi.spyOn(SessionContext, "useSessionContext").mockImplementation(() => {
        return {
            session: null,
            loading: false,
            user: null,
            setUser: () => null,
        }
    })

    vi.spyOn(SessionContext, "SessionProvider").mockImplementation(({ children }) => {
        return <>{children}</>
    })
}

export const simulateMockSession = () => {
    vi.spyOn(supabase.auth, "onAuthStateChange").mockImplementation(() => {
        return {
            data: {
                subscription: {
                    id: dummyUUID,
                    callback: () => null,
                    unsubscribe: () => null
                }
            }
        }
    })

    vi.spyOn(SessionContext, "useSessionContext").mockReturnValue({
        session: dummySession,
        loading: false,
        user: dummyUser,
        setUser: () => null,
    })

    vi.spyOn(SessionContext, "SessionProvider").mockImplementation(({ children }) => {
        return <>{children}</>
    })

    vi.spyOn(AuthController, "isFirstTimeUser").mockResolvedValue(false)
}