import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MessageProvider } from "../../common/contexts/AlertContext";
import { NotificationProvider } from "../../common/contexts/NotificationContext";
import { OrgContext, type NoOrg, type ValidOrg } from "../../common/contexts/OrgContext";
import { PageTitleProvider } from "../../common/contexts/PageTitleContext";
import { ProfileContext } from "../../common/contexts/ProfileContext";
import { SessionContext } from "../../common/contexts/SessionContext";
import { ThemeModeProvider } from "../../common/contexts/ThemeContext";
import ThemeUsage from "../../common/contexts/ThemeProvider";
import type React from "react";
import { vi } from "vitest";

export interface MockContextProviderProps {
    hasSession?: boolean,
    hasOrganization?: boolean
    children?: React.ReactNode
}

export default function MockContextProvider({
    hasSession,
    hasOrganization,
    children }: MockContextProviderProps) {

    const session = hasSession
        ? vi.fn(() => ({
            session: {
                access_token: "",
                refresh_token: "",
                expires_in: 0,
                token_type: "",
                user: {
                    id: "7a4af5c3-6640-45c3-94a7-d34bd6fbde02",
                    app_metadata: {},
                    user_metadata: {},
                    aud: "",
                    created_at: ""
                }
            }, user: { id: "7a4af5c3-6640-45c3-94a7-d34bd6fbde02", name: "Test", email: "", imageFile: "", createdAt: "" },
            setUser: () => { }, loading: false
        }))
        : vi.fn(() => ({ session: null, user: null, setUser: () => { }, loading: false }))

    const organization = hasOrganization
        ? vi.fn(() => ({ org: {id: 1, name: "Test", imageFile: "", role: "owner" as const}, setOrg: (_org: null) => { }, loading: false }) as ValidOrg)
        : vi.fn(() => ({ org: null, setOrg: (_org: null) => { }, loading: false }) as NoOrg)

    const profile = vi.fn(() => ({fileName: "", blobUrl: undefined, setFileName: () => {}}))

    return (
        <ThemeUsage>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MessageProvider>
                    <SessionContext.Provider value={{ ...session() }}>
                        <ProfileContext.Provider value={{ ...profile() }}>
                            <ThemeModeProvider>
                                <OrgContext.Provider value={{ ...organization() }}>
                                    <PageTitleProvider>
                                        <NotificationProvider>
                                            {children}
                                        </NotificationProvider>
                                    </PageTitleProvider>
                                </OrgContext.Provider>
                            </ThemeModeProvider>
                        </ProfileContext.Provider>
                    </SessionContext.Provider>
                </MessageProvider>
            </LocalizationProvider>
        </ThemeUsage>
    )
}