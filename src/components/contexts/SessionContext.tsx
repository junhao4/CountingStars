import type { Session } from "@supabase/supabase-js"
import { createContext, useContext, useEffect, useState } from "react"
import supabase from "../../helper/supabaseClient";



interface SessionContextProps {
    session: Session | null
    loading: boolean
    userName: string
    nameRefresh: boolean
    setNameRefresh: React.Dispatch<React.SetStateAction<boolean>>
}

export const SessionContext = createContext<SessionContextProps>({
    session: null,
    loading: true,
    userName: "",
    nameRefresh: true,
    setNameRefresh: () => {}
});

export const SessionProvider = ({ children } : { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [nameRefresh, setNameRefresh] = useState(true)
  const [userName, setuserName] = useState("")

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setLoading(false);
    });

    //checks and dynamically updates session state throughout all components that have access to context
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
        if (event)
        setSession(session);
    });

    return () => data.subscription.unsubscribe();
  }, []);

   useEffect(() => {
        const getName = async () => {
            const { data, error } = await supabase
                .from('Users')
                .select()
                .eq('user_id', session?.user.id!)
                .single()
            if (data) {
                setuserName(data.name!)
                console.log("Name context set", userName)
            }
            if (error) {
                console.log("Name context not set", error)
            }
        }
        if (session) getName()
    }, [nameRefresh, session])


    return (
        <SessionContext.Provider value={{ session, loading, userName, nameRefresh, setNameRefresh }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSessionContext = () => useContext(SessionContext)