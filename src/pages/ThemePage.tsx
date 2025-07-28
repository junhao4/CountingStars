import { Box, Container } from "@mui/material";
import { ThemeSettingsBox } from "../features/theme/components/ThemeSettingsBox";
import { useEffect } from "react";
import { useAlertContext } from "../common/contexts/AlertContext";



export default function ThemePage() {
   
    const { createAlert } = useAlertContext()

    useEffect(() => {
        createAlert('success', "This is a success message")
    }, [])
  
    return (
        <>
            <Container sx={{ mt: 4 }}>
                <ThemeSettingsBox></ThemeSettingsBox>
                <Box
                    sx={{
                        mb: 20,
                        border: "1px solid var(--border)",
                        p: 2,
                        borderRadius: 2,
                        width: "80%",
                    }}
                >
                   
                </Box>
            </Container>
        </>
    );
}
