import { createContext, useContext, useState } from "react"
import type { OrganizationRolesType } from "../../helper/types"

export interface OrgProps {
    id: number // org id
    name: string
    role: OrganizationRolesType
}

interface OrgContextProps {
    getOrgContext: () => OrgProps | null
    setOrgContext: (arg0: OrgProps | null) => void
    loading: boolean
}

export const OrgContext = createContext<OrgContextProps>({
    getOrgContext: () => null,
    setOrgContext: () => null,
    loading: true
});

export const OrgProvider = ({ children } : { children: React.ReactNode }) => {
  const [orgContext, set] = useState<OrgProps | null>(null);
  const [loading] = useState(true);

    const getOrgContext = () => {
        if (orgContext !== null) return orgContext
        const Json = sessionStorage.getItem('orgContext')
        if (Json) return JSON.parse(Json)
        return null
    }

    const setOrgContext = (arg0: OrgProps | null) => {
        set(arg0)
        if (!!!arg0) sessionStorage.removeItem('orgContext')
        else sessionStorage.setItem('orgContext', JSON.stringify(arg0))
    }

    return (
        <OrgContext.Provider value={{ getOrgContext, setOrgContext, loading }}>
            {children}
        </OrgContext.Provider>
    );
};

export const useOrgContext = () => useContext(OrgContext)