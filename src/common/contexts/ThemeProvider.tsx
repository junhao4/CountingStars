import { ThemeProvider, createTheme } from "@mui/material";
import type React from "react";
import type { } from '@mui/x-data-grid/themeAugmentation';
import type {} from '@mui/x-date-pickers/themeAugmentation';


const customTheme = createTheme({
    colorSchemes: {
        dark: {
            palette: {
                primary: { // Black
                    light: 'rgba(255, 255, 255, 1)',
                    main: 'rgba(214, 214, 214, 1)',
                    dark: 'rgba(192, 192, 192, 1)186, 1)',
                    contrastText: 'rgba(0, 0, 0, 1)',
                },

                secondary: { // Yellow
                    light: 'rgba(235, 231, 140, 1)',
                    main: 'rgba(199, 197, 70, 1)',
                    dark: 'rgba(145, 130, 43, 1)',
                    contrastText: 'rgb(255, 255, 255)',
                },

                info: { // Blue
                    light: "#96eaff",
                    main: "#2990ff",
                    dark: "#0021c7",
                    contrastText: 'rgb(255, 255, 255)',
                },

                error: { // Red
                    light: 'rgb(215, 21, 21)',
                    main: 'rgb(185, 8, 8)',
                    dark: 'rgb(88, 0, 0)',
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
                    main: 'rgba(41, 41, 41, 1)',
                    dark: 'rgb(0, 0, 0)',
                    contrastText: "#ffffff",
                },

                secondary: { // Purple
                    light: 'rgba(241, 179, 247, 1)',
                    main: 'rgba(219, 135, 236, 1)',
                    dark: 'rgba(170, 95, 205, 1)',
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


    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    minWidth: '0',
                    transition: 'background-color 250ms linear'
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

        MuiTextField: {
            styleOverrides: {
                root: {
                    color: 'var(--text)',
                    backgroundColor: 'transparent',
                    justifyContent:'center',
                    
                }
            },
            defaultProps: {
                color: 'secondary',
                variant: 'standard',
            }
        },

        MuiPaper: {
            styleOverrides: {
                root: {
                    padding: '1rem',
                    color: 'var(--text)',
                    backgroundColor: 'var(--card)',
                    transition: 'background-color 250ms linear'
                },
            },
            defaultProps: {
                elevation: 2
            }
        },

        MuiSelect: {
            defaultProps: {
                color: 'secondary',
                size: 'small'
            }
        },

        MuiDataGrid: {
            styleOverrides: {
                root: {
                    backgroundColor: 'var(--card)',
                    outline: '1px solid var(--border)',
                    border: 0,
                    textAlign: 'center',
                    textWrap: 'wrap',
                    padding: '0.5rem'
                },
            },
            defaultProps: {
            }
        },

        MuiDateField: {
            defaultProps: {
                color: 'secondary'
            }
        },

        MuiMenu: {
            styleOverrides: {
                root: {
                    transition: "background-color 250ms linear"
                }
            }
        },

        MuiMenuItem: {
            styleOverrides: {
                root: {
                    transition: "background-color 250ms linear"
                }
            }
        },

        MuiList: {
            styleOverrides: {
                root: {
                    transition: "background-color 250ms linear"
                }
            }
        },

        MuiMenuList: {
            styleOverrides: {
                root: {
                    transition: "background-color 250ms linear"
                }
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