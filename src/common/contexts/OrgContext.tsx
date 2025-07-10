import { createContext, useContext, useEffect, useState, type SetStateAction } from "react"
import type { Organization } from "../../helper/types"
import Loading from "../components/Loading"

export interface ValidOrg {
    org: Organization
    setOrg: React.Dispatch<SetStateAction<Organization | null>>
    loading: boolean
}

export interface NoOrg {
    org: null
    setOrg: React.Dispatch<SetStateAction<Organization | null>>
    loading: boolean
}

export const OrgContext = createContext<ValidOrg | NoOrg>({
    org: null,
    setOrg: () => null,
    loading: true
});

export const OrgProvider = ({ children }: { children: React.ReactNode }) => {
    const [org, setOrg] = useState<Organization | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const org = localStorage.getItem("orgContext")
        if (org) { setOrg(JSON.parse(org))}
        setLoading(false)
    }, [])

    if (loading) {return <Loading />}

    return (
        <OrgContext.Provider value={{ org, setOrg, loading }}>
            {children}
        </OrgContext.Provider>
    );
};

export const useOrgContext = () => useContext(OrgContext)