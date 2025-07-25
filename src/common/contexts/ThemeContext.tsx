import { useColorScheme, useMediaQuery } from "@mui/material";
import { createContext, useContext, useEffect, useState } from "react";
import { fetchUser } from "../api/UserApi";
import { useSessionContext, type ValidSession } from "./SessionContext";
import { calculateLightness, changeAccent, changeBase, changeTheme } from "../../features/theme/api/ThemeApi";

export type ThemeMode = "light" | "dark" | "system" | "custom";

type Theme = "light" | "dark" | "custom-dark" | "custom-light";

export interface ThemeProps {
    themeMode: ThemeMode,
    setAndSaveThemeMode: (themeMode: string) => void,
    setAndSaveBase: (base: string) => void,
    setAndSaveAccent: (accent: string) => void,
    customBase: string,
    customAccent: string

}

const ThemeContext = createContext<ThemeProps>({
    themeMode: "system",
    setAndSaveThemeMode: () => { },
    setAndSaveBase: () => { },
    setAndSaveAccent: () => { },
    customBase: "",
    customAccent: ""
})


export const ThemeModeProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useSessionContext() as ValidSession

    const [themeMode, setThemeMode] = useState<ThemeMode>("system")
    const [theme, setTheme] = useState<Theme>("dark")
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const [customBase, setCustomBase] = useState("#ffffff")
    const [customAccent, setCustomAccent] = useState("#ffffff")
    
    //MUI theme
    const { setMode } = useColorScheme()
    const setAndSaveThemeMode = (themeMode: string) => {
        setThemeMode(themeMode as ThemeMode)
        changeTheme(user.id!, themeMode)
    }
    const setAndSaveBase = (base: string) => {
        setCustomBase(base)
        changeBase(user.id!, base)
    }
    const setAndSaveAccent = (accent: string) => {
        setCustomAccent(accent)
        changeAccent(user.id!, accent)
    }


    useEffect(() => {
        const getTheme = async () => {
            const res = await fetchUser(user.id!);
            if (!res) {
                return
            }
            setThemeMode(res.theme as ThemeMode)
            setCustomBase(res!.base)
            setCustomAccent(res!.accent)
        }
        user && getTheme()
    }, [user])


    useEffect(() => {
        if (themeMode == 'system') {
            setTheme(prefersDarkMode ? "dark" : "light")
            setMode(prefersDarkMode ? "dark" : "light")
        } else if (themeMode == 'custom') {
            if (calculateLightness(customBase) > 50) {
                setTheme("custom-light")
                setMode("light")
            } else {
                setTheme("custom-dark")
                setMode("dark")
            }
            document.documentElement.style.setProperty('--base-color', customBase);
            document.documentElement.style.setProperty('--accent', customAccent);
        } else {
            setTheme(themeMode)
            setMode(themeMode)
        }

    }, [themeMode, prefersDarkMode, customBase, customAccent]);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
    }, [theme])

    return (
        <ThemeContext.Provider value={{ themeMode, setAndSaveThemeMode, setAndSaveBase, setAndSaveAccent, customAccent, customBase }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useThemeContext = () => useContext(ThemeContext);


