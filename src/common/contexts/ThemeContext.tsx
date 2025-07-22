import { useColorScheme, useMediaQuery } from "@mui/material";
import { createContext, useContext, useEffect, useState } from "react";
import { fetchUser } from "../api/UserApi";
import { useSessionContext } from "./SessionContext";
import { calculateLightness, changeAccent, changeBase, changeTheme } from "../../features/theme/api/ThemeApi";

export type ThemeMode = "light" | "dark" | "system" | "custom";

type Theme = "light" | "dark" | "custom-dark" | "custom-light";

interface ThemeProps {
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
    const [themeMode, setThemeMode] = useState<ThemeMode>("system")
    const [theme, setTheme] = useState<Theme>("dark")
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const [customBase, setCustomBase] = useState("")
    const [customAccent, setCustomAccent] = useState("")
    const { session } = useSessionContext()
    //MUI theme
    const { setMode } = useColorScheme()
    const setAndSaveThemeMode = (themeMode: string) => {
        setThemeMode(themeMode as ThemeMode)
        changeTheme(session?.user.id!, themeMode)
    }
    const setAndSaveBase = (base: string) => {
        setCustomBase(base)
        changeBase(session?.user.id!, base)
    }
    const setAndSaveAccent = (accent: string) => {
        setCustomAccent(accent)
        changeAccent(session?.user.id!, accent)
    }


    useEffect(() => {
        const getTheme = async () => {
            const user = await fetchUser(session?.user.id!);
            const userTheme = user!.theme
            const base = user!.base
            const accent = user!.accent
            setThemeMode(userTheme as ThemeMode)
            setCustomBase(base)
            setCustomAccent(accent)
        }
        if (session) {
            getTheme()
        }
    }, [session])


    useEffect(() => {
        if (themeMode == 'system') {
            setTheme(prefersDarkMode ? "dark" : "light")
            setMode(prefersDarkMode ? "dark" : "light")
        } else if (themeMode == 'custom') {

            console.log(customBase)
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


