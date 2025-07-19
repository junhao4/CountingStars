import {
    Container
} from "@mui/material";

import { ThemeSettingsBox } from "../features/theme/components/ThemeSettingsBox";


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