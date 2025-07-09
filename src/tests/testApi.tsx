import { vi, type Mock } from "vitest"
import supabase from "../helper/supabaseClient"
import type { PostgrestResponseFailure, PostgrestResponseSuccess } from "@supabase/postgrest-js"
import type { Session } from "@supabase/supabase-js"
import * as SessionContext from "../common/contexts/SessionContext"

import * as AuthController from "../features/authentication/api/AuthApi"
import type { User } from "../helper/types"

export const dummyUUID = "7a4af5c3-6640-45c3-94a7-d34bd6fbde02"
export const dummyUser = { id: dummyUUID, name: "Test", imageFile: "", email: "", createdAt: "" }
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