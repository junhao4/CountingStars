import supabase from "../../../helper/supabaseClient";
import type { AlertType } from "../../../common/contexts/AlertContext";

interface EmailProps {
    email: string,
    password: string,
    createAlert: (arg0: AlertType, arg1: string) => void,
}

export const loginWithEmail = async ({ email, password, createAlert }: EmailProps) => {
    const res = await supabase.auth.signInWithPassword({
        email, password
    })
    if (res.error) {
        createAlert('error', "Unable to login: " + res.error.message);
        return null
    }
    else return res.data
}

export const registerWithEmail = async ({ email, password, createAlert }: EmailProps) => {
    if (email == "" || password == "") {
        createAlert('warning', "Please fill in the blanks")
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
            createAlert("error", "Error registering: " + error.message)
            return
        }

        if (data.user?.identities && data.user.identities.length > 0) {
            createAlert('success', "A link will be sent to your email, this may take up to a few minutes");
        } else {
            createAlert('warning', "Email address is already taken!");
        }
    }
}

export const resetPasswordForEmail = async ({ email, createAlert }: Omit<EmailProps, "password">) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "https://counting-stars-jade.vercel.app/reset",
    });
    if (error) {
        createAlert('error', error.message)
        return false
    }
    createAlert('success', "A link was sent to your email")
    return true
}