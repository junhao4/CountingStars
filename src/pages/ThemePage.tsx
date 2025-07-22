import { Box, Button, Container, Typography } from "@mui/material";

import { ThemeSettingsBox } from "../features/theme/components/ThemeSettingsBox";
import { useEffect, useState } from "react";
import { useThemeContext } from "../common/contexts/ThemeContext";

export default function ThemePage() {
    const testing =
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Test.svg/2560px-Test.svg.png";

   


    return (
        <>
            <Container sx={{ mt: 4 }}>
                <ThemeSettingsBox></ThemeSettingsBox>

               
            </Container>
        </>
    );
}
