import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { SessionProvider } from "./SessionContext";
import { OrgProvider } from "./OrgContext";
import { PageTitleProvider } from "./PageTitleContext";
import { MessageProvider } from "./AlertContext";
import ThemeUsage from "./ThemeProvider";


export default function ContextProvider({ children }: { children: React.ReactNode }) {
    return (
        <ThemeUsage>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MessageProvider>
                    <SessionProvider>
                        <OrgProvider>
                            <PageTitleProvider>
                                    {children}
                            </PageTitleProvider>
                        </OrgProvider>
                    </SessionProvider>
                </MessageProvider>
            </LocalizationProvider>
        </ThemeUsage>
    )
}