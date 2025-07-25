import type { Session } from "@supabase/supabase-js"
import { createContext, useContext, useEffect, useState, type SetStateAction } from "react"
import supabase from "../../helper/supabaseClient";
import type { FirstTimeUser, User } from "../../helper/types";
import { fetchUser, handleFirstTimeUser } from "../api/UserApi";
import Loading from "../components/Loading";

export type ValidSession = {
    session: Session,
    user: User | FirstTimeUser,
    loading: boolean,
    setUser: React.Dispatch<SetStateAction<User | FirstTimeUser | null>>
}

export type NoSession = {
    session: null,
    user: null,
    loading: boolean,
    setUser: React.Dispatch<SetStateAction<User | FirstTimeUser | null>>
}

type SessionContextProps = (ValidSession | NoSession)

export const SessionContext = createContext<SessionContextProps>({
    session: null,
    loading: true,
    user: null,
    setUser: () => null,
});

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null)
    const [user, setUser] = useState<User | FirstTimeUser | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            if (session) {
                setSession(session)
            } else {
                setSession(null)
                setLoading(false)
            }
        });

        // Checks and dynamically updates session state throughout all components that have access to context
        supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                setSession(session!)
            } else if (event === 'SIGNED_OUT') {
                setSession(null)
            }
        })
    }, []);

    useEffect(() => {
        if (session) {            
            new Promise(async () => {
                const data = await fetchUser(session?.user.id)

                if (data) {
                    setUser(prev => {
                        if (prev?.id === data.user_id) {
                            return prev
                        }
                        return {
                            ...data, id: data.user_id, createdAt: data.created_at, name: data.name || "NO NAME",
                            imageFile: data.image_file || "Default_pfp.jpg"
                        }
                    })
                    setLoading(false)
                } else {
                    const data = await handleFirstTimeUser(session.user.id, session.user.email!)
                    if (data) setUser(prev => {
                        if (prev?.id === data.user_id) {
                            return prev
                        }
                        return {
                            ...data, id: data.user_id, createdAt: data.created_at, name: data.name || "NO NAME",
                            imageFile: data.image_file || "Default_pfp.jpg"
                        }
                    })
                }
            })
        }
    }, [session])

    if (loading) return <Loading />

    if (session && user) {
        return (
            <SessionContext.Provider value={{ session, user, setUser, loading }}>
                {children}
            </SessionContext.Provider>
        );
    } else {
        return (
            <SessionContext.Provider value={{ session: null, user: null, setUser, loading }}>
                {children}
            </SessionContext.Provider>
        )
    }
};

export const useSessionContext = () => useContext(SessionContext)