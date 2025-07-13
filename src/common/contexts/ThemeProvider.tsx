import { ThemeProvider, createTheme } from "@mui/material";
import type React from "react";
import type { } from '@mui/x-data-grid/themeAugmentation';


const customTheme = createTheme({
    colorSchemes: {
        dark: {
            palette: {
                primary: { // Black
                    light: 'rgb(63, 63, 62)',
                    main: 'rgb(28, 28, 27)',
                    dark: 'rgb(18, 18, 17)',
                    contrastText: 'rgb(255, 255, 255)',
                },

                secondary: { // Yellow
                    light:'rgb(221, 215, 46)',
                    main:'rgb(182, 145, 32)',
                    dark:'rgb(188, 109, 19)',
                    contrastText: 'rgb(255, 255, 255)',
                },

                info: { // Blue
                    light: "#96eaff",
                    main: "#2990ff",
                    dark: "#0021c7",
                    contrastText: 'rgb(255, 255, 255)',
                },

                error: { // Red
                    light:'rgb(215, 21, 21)',
                    main:'rgb(185, 8, 8)',
                    dark:'rgb(88, 0, 0)',
                    contrastText: 'rgb(255, 255, 255)',
                },

                success: { // Green
                    light: '#61a655',
                    main: '#61a655',
                    dark: '#61a655',
                    contrastText: 'rgb(255, 255, 255)',
                },

                DataGrid: {
                    bg: 'var(--table)',
                    headerBg: 'var(--table-header)',
                    pinnedBg: 'var(--table-header)'
                }
            }
        },

        light: {
            palette: {
                primary: { // Black
                    light: 'rgb(79, 79, 79)',
                    main: 'rgb(28, 28, 28)',
                    dark: 'rgb(0, 0, 0)',
                    contrastText: "#ffffff",
                },

                secondary: { // Purple
                    light: 'rgb(248, 168, 255)',
                    main: 'rgb(227, 85, 255)',
                    dark: 'rgb(185, 78, 234)',
                    contrastText: "#000000",
                },

                info: { // Blue
                    light: 'rgb(145, 233, 255)',
                    main: 'rgb(87, 168, 255)',
                    dark: 'rgb(41, 111, 181)',
                    contrastText: "#000000",
                },

                error: { // Red
                    light: 'rgb(255, 139, 139)',
                    main: 'rgb(255, 101, 101)',
                    dark: 'rgb(203, 46, 46)',
                    contrastText: "#000000"
                },

                success: { // Green
                    light: '#61a655',
                    main: '#61a655',
                    dark: '#61a655',
                    contrastText: '#000'
                },

                DataGrid: {
                    bg: 'var(--table)',
                    headerBg: 'var(--table-header)',
                    pinnedBg: 'var(--table-header)'
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

        MuiDataGrid: {
            styleOverrides: {
                root: {
                    outline:'1px solid black',
                    border: 0,
                    textAlign: 'center',
                    textWrap: 'wrap',
                },
            },
            defaultProps: {
            }
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