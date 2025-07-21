import { Button, Container } from "@mui/material";

import { ThemeSettingsBox } from "../features/theme/components/ThemeSettingsBox";
import { useState } from "react";
import { useThemeContext } from "../common/contexts/ThemeContext";

export default function ThemePage() {
    const testing =
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Test.svg/2560px-Test.svg.png";

    const [selectedBase, setSelectedBase] = useState("#ffffff");
    const [selectedAccent, setSelectedAccent] = useState("#ffffff");
    const { setCustomBase, setCustomAccent } = useThemeContext();

    return (
        <>
            <Container sx={{ mt: 4 }}>
                <ThemeSettingsBox></ThemeSettingsBox>

                <input
                    type="color"
                    value={selectedBase}
                    onChange={(e) => setSelectedBase(e.target.value)}
                />
                <Button
                    variant="contained"
                    sx={{ ml: 2 }}
                    onClick={() => {
                        setCustomBase(selectedBase);
                    }}
                >
                    Confirm Color
                </Button>
                 <input
                    type="color"
                    value={selectedAccent}
                    onChange={(e) => setSelectedAccent(e.target.value)}
                />
                <Button
                    variant="contained"
                    sx={{ ml: 2 }}
                    onClick={() => {
                        setCustomAccent(selectedAccent);
                    }}
                >
                    Confirm Accent
                </Button>
            </Container>
        </>
    );
}
