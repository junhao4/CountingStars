import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { SessionProvider } from "./SessionContext";
import { OrgProvider } from "./OrgContext";
import { PageTitleProvider } from "./PageTitleContext";
import { MessageProvider } from "./AlertContext";
import ThemeUsage from "./ThemeProvider";
import { ThemeModeProvider } from "./ThemeContext";

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
                        <ThemeModeProvider>
                            <OrgProvider>
                                <PageTitleProvider>
                                    {children}
                                </PageTitleProvider>
                            </OrgProvider>
                        </ThemeModeProvider>
                    </SessionProvider>
                </MessageProvider>
            </LocalizationProvider>
        </ThemeUsage>
    );
}
