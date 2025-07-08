import type { ChangeEvent, SetStateAction } from "react"
import supabase from "../../helper/supabaseClient"
import type { AlertType } from "../contexts/AlertContext"
import type { ValidSession } from "../contexts/SessionContext"


export const fetchUser = async (userId: string) => {
    const { data, error } = await supabase
        .from('Users')
        .select('*')
        .eq('user_id', userId)
        .single()

    if (error) {
        console.log("Error fetching user from supabase, ", error.message)
        return null
    }
    return data
}

export const fetchProfileImage = async (userId: string, createAlert: (arg0: AlertType, arg1: string) => void) => {
    console.log("Fetching user profile URL")
    const { data, error } = await supabase
        .from("Users")
        .select("image_file")
        .eq("user_id", userId)
        .single()
    if (error) {
        createAlert('error', error.message)
        return null
    } else {
        return data.image_file
    }
};

// Download profile image of user
export const downloadProfileImage = async (profileUrl: string) => {
    const { data, error } = await supabase.storage
        .from("profile-images")
        .download(profileUrl);
    if (error) {
        console.error("Error downloading image:", error.message)
        return null
    } else {
        return data
    }
}

//Creates new user for first time users in supabase with default name and pfp
export const handleFirstTimeUser = async (
    userId: string,
    userEmail: string
) => {
    const { data } = await supabase
        .from("Users")
        .select()
        .eq("user_id", userId)
        .maybeSingle();

    if (data) {
        // User exists already
        return null
    } else {
        const { data, error } = await supabase
            .from("Users")
            .insert({
                user_id: userId,
                name: "Default User",
                image_file: "Default_pfp.jpg",
                email: userEmail,
            })
            .select()
            .single()

        if (error) {
            console.log("error", error.message);
        }
        return data
    }
}