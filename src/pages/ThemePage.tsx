import { Box, Container } from "@mui/material";
import { ThemeSettingsBox } from "../features/theme/components/ThemeSettingsBox";


export default function ThemePage() {
   
  
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
