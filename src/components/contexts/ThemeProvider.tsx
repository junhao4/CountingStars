import { ThemeProvider, createTheme } from "@mui/material";
import type React from "react";


const customTheme = createTheme({
    colorSchemes: {
        dark: true,
    },

    typography: {
        fontFamily: [
            'Roboto'
        ].join(','),
    },

    palette: {
        mode: "dark",

        primary: { // Black
            light: "#6b6b6b",
            main: "#000",
            dark: "#3b3b3b",
            contrastText: "#fff",
        },

        secondary: { // Yellow
            light: "#fffdb3",
            main: "#fff700",
            dark: `#e8b235`,
            contrastText: "#000",
        },

        info: { // Blue
            light: "#96eaff",
            main: "#2990ff",
            dark: "#0021c7",
            contrastText: "#000",
        },

        error: { // Red
            light: "#a00",
            main: "#f00",
            dark: "#faa",
            contrastText: "#000"
        },

        success: { // Green
            light: '#61a655',
            main: '#61a655',
            dark: '#61a655',
            contrastText: '#000'
        }
    },
    defaultColorScheme: 'dark',

    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    minWidth: '0',
                },

            },
            defaultProps: {
                disableFocusRipple: true,
                disableRipple: true,
                size: 'small',
                color: 'primary',
                variant: 'outlined',
            },
            
        },

        MuiPaper: {
            styleOverrides: {
                root: {
                    padding: '1rem',
                    color: 'var(--card)',
                    backgroundColor: 'var(--card-foreground)'
                },
            },
            defaultProps: {
                elevation: 2
            }
        },
    }

})

export default function ThemeUsage({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider theme={customTheme}>
            {children}
        </ThemeProvider>
    )
}