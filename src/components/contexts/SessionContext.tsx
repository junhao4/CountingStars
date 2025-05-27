import type { Session } from "@supabase/supabase-js"
import { createContext, useContext, useEffect, useState } from "react"
import supabase from "../../helper/supabaseClient";



interface SessionContextProps {
    session: Session | null
    loading: boolean
}

export const SessionContext = createContext<SessionContextProps>({
    session: null,
    loading: true
});

export const SessionProvider = ({ children } : { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setLoading(false);
    });

    //checks and dynamically updates session state throughout all components that have access to context
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
        setSession(session ?? null);
    });

    return () => data.subscription.unsubscribe();
  }, []);


    return (
        <SessionContext.Provider value={{ session, loading }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => useContext(SessionContext)