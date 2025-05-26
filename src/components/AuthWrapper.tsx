import React, { useEffect, useState } from "react"
import supabase from "../helper/supabaseClient"
import type { User } from "@supabase/supabase-js"
import { Navigate, useNavigate } from "react-router-dom"
import type { AuthProps } from "./pages/Auth"

interface AuthWrapperProps {
    children: React.ReactElement<AuthProps>
}

export default function AuthWrapper({ children, ...otherProps }: AuthWrapperProps) {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        supabase.auth.getSession()
            .then(response => {
                setUser(response.data.session?.user || null);
                setLoading(false)
            })
    }, [])


    if (loading) {
        console.log(1)
        return (<p>Loading...</p>)
    } else if (!!!user) {
        console.log(2)
        return React.cloneElement(children, { ...otherProps, user })
    } else {
        console.log(3)
        return (<></>)
    }
}