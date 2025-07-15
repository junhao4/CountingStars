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