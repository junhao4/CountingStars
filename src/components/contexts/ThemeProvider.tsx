import { ThemeProvider, createTheme } from "@mui/material";
import type React from "react";


const customTheme = createTheme({
    colorSchemes: {
        dark: {
            palette: {
                primary: { // Black
                    light:'rgb(63, 63, 62)',
                    main:'rgb(28, 28, 27)',
                    dark:'rgb(18, 18, 17)',
                    contrastText: 'rgb(255, 255, 255)',
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
                    light:'rgb(166, 166, 166)',
                    main:'rgb(75, 75, 75)',
                    dark:'rgb(0, 0, 0)',
                    contrastText: "#ffffff",
                },

                secondary: { // Purple
                    light:'rgb(247, 159, 255)',
                    main: 'rgb(215, 16, 255)',
                    dark:'rgb(152, 0, 223)',
                    contrastText: "#000000",
                },

                info: { // Blue
                    light: 'rgb(145, 233, 255)',
                    main:'rgb(87, 168, 255)',
                    dark:'rgb(19, 137, 255)',
                    contrastText: "#000000",
                },

                error: { // Red
                    light:'rgb(255, 139, 139)',
                    main:'rgb(255, 66, 66)',
                    dark:'rgb(218, 0, 0)',
                    contrastText: "#000000"
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