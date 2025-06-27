import { ThemeProvider, createTheme } from "@mui/material";
import type React from "react";


const customTheme = createTheme({
    colorSchemes: {
        dark: {
            palette: {
                primary: { // Black
                    light: "#6b6b6b",
                    main: "#fff",
                    dark: "#3b3b3b",
                    contrastText: "#000",
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
            }
        },

        light: {
            palette: {
                primary: { // Black
                    light: "#2b2b2b",
                    main: "#000",
                    dark: "#000",
                    contrastText: "#fff",
                },

                secondary: { // Purple
                    light: "#864ebf",
                    main: "#850fff",
                    dark: `#1b0433`,
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
            }
        },
    },

    typography: {
        fontFamily: [
            'Roboto'
        ].join(','),
    },

    defaultColorScheme: 'light',

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
                    color: 'var(--card-foreground)',
                    backgroundColor: 'var(--card)',
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