import type { Session } from "@supabase/supabase-js"
import { useSessionContext } from "../../../common/contexts/SessionContext"
import supabase from "../../../helper/supabaseClient"


export const changeTheme = async (userId : string, theme : string) => {
    const { data, error } = await supabase
        .from('Users')
        .update({theme : theme})
        .eq('user_id', userId)
        .single()

    if (error) {
        console.log("Error updating theme")
    } else {
        console.log("Edited theme", data)
        
    }
}

export const calculateLightness = (hex : string) => {
    hex = hex.replace(/^#/, '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)

    const brightness = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
    return +(brightness * 100).toFixed(2)
}