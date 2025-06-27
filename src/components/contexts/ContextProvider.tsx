import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { SessionProvider } from "./SessionContext";
import { OrgProvider } from "./OrgContext";
import { PageTitleProvider } from "./PageTitleContext";
import { MessageProvider } from "./MessageContext";
import ThemeUsage from "./ThemeProvider";
import { NotificationProvider } from "./NotificationContext";


export default function ContextProvider({ children }: { children: React.ReactNode }) {
    return (
        <ThemeUsage>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <SessionProvider>
                    <OrgProvider>
                        <PageTitleProvider>
                            <MessageProvider>
                                <NotificationProvider>
                                {children}
                                </NotificationProvider>
                            </MessageProvider>
                        </PageTitleProvider>
                    </OrgProvider>
                </SessionProvider>
            </LocalizationProvider>
        </ThemeUsage>
    )
}