import supabase from "../../../helper/supabaseClient";

interface EmailProps {
    email: string,
    password: string,
}

export const loginWithEmail = async ({ email, password }: EmailProps) => {
    if (email === '' || password === '') {
        return {error: "Fields cannot be empty!"}
    }
    const { data, error } = await supabase.auth.signInWithPassword({
        email, password
    })
    if (error) {
        console.error(error.message);
        return { error: error.message }
    }
    return { data }
}

export const registerWithEmail = async ({ email, password }: EmailProps) => {
    if (email == "" || password == "") {
        return { error: "Fields cannot be empty" }
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: "https://counting-stars-jade.vercel.app/verify",
        },
    })

    if (error) {
        console.error(error.message)
        return { error: error.message }
    }

    if (data.user?.identities && data.user.identities.length > 0) {
        return {data}
    } else {
        return {error: "Email address is already registered!"}
    }
}

export const resetPasswordForEmail = async ({ email }: Omit<EmailProps, "password">) => {
    if (email === '') {
        return {error: "Email field cannot be empty!"}
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "https://counting-stars-jade.vercel.app/reset",
    });
    if (error) {
        console.error(error.message)
        return {error: error.message}
    }
    return {data: true}
}