import supabase from "../../../helper/supabaseClient";
import type { VariantType } from "../../contexts/MessageContext";

interface EmailProps {
    email: string,
    password: string,
    createMessage: (arg0: VariantType, arg1: string) => void,
}

export const loginWithEmail = async ({ email, password, createMessage }: EmailProps) => {
    const res = await supabase.auth.signInWithPassword({
        email, password
    })
    if (res.error) {
        createMessage('error', "Unable to login: " + res.error.message);
        return null
    }
    else return res.data
}

export const registerWithEmail = async ({ email, password, createMessage }: EmailProps) => {
    if (email == "" || password == "") {
        createMessage('warning', "Please fill in the blanks")
        return
    } else {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: "https://counting-stars-jade.vercel.app/verify",
            },
        })
        if (error) {
            createMessage("error", "Error registering: " + error.message)
            return
        }

        if (data.user?.identities && data.user.identities.length > 0) {
            createMessage('success', "A link will be sent to your email, this may take up to a few minutes");
        } else {
            createMessage('warning', "Email address is already taken!");
        }
    }
}

export const resetPasswordForEmail = async ({ email, createMessage }: Omit<EmailProps, "password">) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "https://counting-stars-jade.vercel.app/reset",
    });
    if (error) {
        createMessage('error', error.message)
        return
    }
    createMessage('success', "A link was sent to your email")
}

export const isFirstTimeUser = async (user_id: string) => {
    const { data, error } = await supabase
        .from("Users")
        .select("name")
        .eq("user_id", user_id)
        .maybeSingle()

    if (error) {
        console.log(error.message)
    }

    if (error || data?.name === null) {
        return true
    }
    return false
}