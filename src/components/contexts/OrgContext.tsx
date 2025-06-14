import { createContext, useContext, useEffect, useState } from "react"
import { type OrganizationFetch } from "../pages/dashboard/Dashboard";



interface OrgContextProps {
    getOrgContext: () => OrganizationFetch | null
    setOrgContext: (arg0: OrganizationFetch | null) => void
    loading: boolean
}

export const OrgContext = createContext<OrgContextProps>({
    getOrgContext: () => null,
    setOrgContext: (arg0) => null,
    loading: true
});

export const OrgProvider = ({ children } : { children: React.ReactNode }) => {
  const [orgContext, set] = useState<OrganizationFetch | null>(null);
  const [loading, setLoading] = useState(true);

    const getOrgContext = () => {
        if (orgContext !== null) return orgContext
        const Json = localStorage.getItem('orgContext')
        if (Json) return JSON.parse(Json)
        return null
    }

    const setOrgContext = (arg0: OrganizationFetch | null) => {
        set(arg0)
        if (!!!arg0) localStorage.removeItem('orgContext')
        else localStorage.setItem('orgContext', JSON.stringify(arg0))
    }

    return (
        <OrgContext.Provider value={{ getOrgContext, setOrgContext, loading }}>
            {children}
        </OrgContext.Provider>
    );
};

export const useOrgContext = () => useContext(OrgContext)