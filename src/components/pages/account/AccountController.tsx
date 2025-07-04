import type { SetStateAction } from "react"
import supabase from "../../../helper/supabaseClient"
import type { VariantType } from "../../contexts/MessageContext"
import type { User } from "../../contexts/SessionContext"

export const handleFirstTimeUser = async (user_id: string, user_email: string) => {
    const { data } = await supabase
        .from('Users')
        .select()
        .eq('user_id', user_id)
        .maybeSingle()

    if (data) {
        // User exists already
    } else {
        const { error } = await supabase
            .from('Users')
            .insert({ user_id, name: "Default User", image_file: 'Default_pfp.jpg', email: user_email })
            .select()

        if (error) {
            console.log('error', error.message)
        }
    }

}

interface UpdateProfileNameProps {
    newName: string,
    user: User, 
    setUser: React.Dispatch<SetStateAction<User | null>>, 
    createMessage: (arg0: VariantType, arg1: string) => void
}

export const updateProfile = async ({newName, user, setUser, createMessage}: UpdateProfileNameProps) => {
    const { data, error } = await supabase
        .from("Users")
        .update({ name: newName })
        .eq("user_id", user.user_id)
        .select();

    if (data) {
        setUser({...user, name: newName });
        createMessage('success', "Successfully set new username!")
    } else {
        console.log('error', error.message);
    }
};