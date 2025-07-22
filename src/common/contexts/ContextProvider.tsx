import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { SessionProvider } from "./SessionContext";
import { OrgProvider } from "./OrgContext";
import { PageTitleProvider } from "./PageTitleContext";
import { MessageProvider } from "./AlertContext";
import ThemeUsage from "./ThemeProvider";
import { ThemeModeProvider } from "./ThemeContext";
import { ProfileProvider } from "./ProfileContext";
import { NotificationProvider } from "./NotificationContext";

export default function ContextProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ThemeUsage>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MessageProvider>
                    <SessionProvider>
                        <ProfileProvider>
                            <ThemeModeProvider>
                                <OrgProvider>
                                    <PageTitleProvider>
                                        <NotificationProvider>
                                            {children}
                                        </NotificationProvider>
                                    </PageTitleProvider>
                                </OrgProvider>
                            </ThemeModeProvider>
                        </ProfileProvider>
                    </SessionProvider>
                </MessageProvider>
            </LocalizationProvider>
        </ThemeUsage>
    );
}
