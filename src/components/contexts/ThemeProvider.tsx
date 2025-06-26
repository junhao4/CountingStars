import { ThemeProvider, createTheme } from "@mui/material";
import type React from "react";


const customTheme = createTheme({
    colorSchemes: {
        dark: false
    },

    typography: {
        fontFamily: [
            'Roboto'
        ].join(','),
    },

    palette: {
        mode: "light",

        primary: { // Black
            light: "#6b6b6b",
            main: "#000",
            dark: "#3b3b3b",
            contrastText: "white",
        },

        secondary: { // Yellow
            light: "#fffdb3",
            main: "#fff700",
            dark: `#e8b235`,
            contrastText: "black",
        },

        info: { // Blue
            light: "#96eaff",
            main: "#2990ff",
            dark: "#0021c7",
            contrastText: "black",
        },

        error: { // Red
            light: "#a00",
            main: "#f00",
            dark: "#faa",
            contrastText: "black"
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    minWidth: '0'
                },

            },
            defaultProps: {
                disableFocusRipple: true,
                disableRipple: true,
                size: 'small',
                color: 'primary',
                variant: 'outlined',
            },
            
        }
    }

})

export default function ThemeUsage({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider theme={customTheme}>
            {children}
        </ThemeProvider>
    )
}