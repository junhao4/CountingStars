import type { Session } from "@supabase/supabase-js"
import { createContext, useContext, useEffect, useState } from "react"
import supabase from "../../helper/supabaseClient";
import { useMessageContext } from "./MessageContext";
import { useNavigate } from "react-router-dom";

export interface User {
    user_id: string
    name: string | null
    email: string
    image_file: string | null
    created_at: string
}

interface SessionContextProps {
    session: Session | null
    loading: boolean
    user: User | null
    setUser: React.Dispatch<React.SetStateAction<User | null>>
}

export const SessionContext = createContext<SessionContextProps>({
    session: null,
    loading: true,
    user: null,
    setUser: () => null,
});

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("Session Context useEffect triggerd!")

        supabase.auth.getSession().then(({ data: { session } }) => {
            console.log(999)
            setSession(session);
            setLoading(false);
        });

        // Checks and dynamically updates session state throughout all components that have access to context
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('supabase onAuthStateChange function called: ' + session)

            if (event === 'SIGNED_IN') {
                console.log(session)
                setSession(session)
            } else if (event === 'SIGNED_OUT') {
                setSession(null)
            }
        })

        return () => data.subscription.unsubscribe();
    }, []);

    // Gets the user
    useEffect(() => {
        console.log('session updated')

        const fetchUser = async () => {
            const { data, error } = await supabase
                .from('Users')
                .select('*')
                .eq('user_id', session!.user.id!)
                .single()

            if (error) {
                console.log("User context not set", error.message)
                return
            }
            setUser(data)
        }

        if (session) {
            fetchUser()
        } else {
            setUser(null)
        }

    }, [session?.access_token])


    return (
        <SessionContext.Provider value={{ session, loading, user, setUser }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSessionContext = () => useContext(SessionContext)