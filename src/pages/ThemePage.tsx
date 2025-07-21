import { Container, TextField } from "@mui/material";

import { ThemeSettingsBox } from "../features/theme/components/ThemeSettingsBox";
import { useState } from "react";

function ThemePage() {
    const testimg =
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Test.svg/2560px-Test.svg.png";

    const [selectedColor, setSelectedColor] = useState("");

    return (
        <>
            <Container sx={{ mt: 4 }}>
                <ThemeSettingsBox></ThemeSettingsBox>

            
                <input
                    type="color"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                />
            </Container>
        </>
    );
}

export default ThemePage;
