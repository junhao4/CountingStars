import { createContext, useContext, useEffect, useState } from "react"
import type { Organization } from "../../helper/types"
import Loading from "../components/Loading"
import { useSessionContext } from "./SessionContext"

export interface ValidOrg {
    org: Organization
    setOrg: (org: Organization | null) => void
    loading: boolean
}

export interface NoOrg {
    org: null
    setOrg: (org: Organization | null) => void
    loading: boolean
}

export const OrgContext = createContext<ValidOrg | NoOrg>({
    org: null,
    setOrg: () => null,
    loading: true
});

export const OrgProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useSessionContext()
    const [org, setOrg] = useState<Organization | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            localStorage.removeItem("orgContext")
            setOrg(null)
        } else {
            const org = localStorage.getItem("orgContext")
            if (org) { setOrg(JSON.parse(org)) }
            setLoading(false)
        }
    }, [user])
    
    const handleSetOrg = (org: Organization | null) => {
        localStorage.setItem("orgContext", JSON.stringify(org))
        setOrg(org)
    }

    if (loading) { return <Loading /> }

    return (
        <OrgContext.Provider value={{ org, setOrg: handleSetOrg, loading }}>
            {children}
        </OrgContext.Provider>
    );
};

export const useOrgContext = () => useContext(OrgContext)