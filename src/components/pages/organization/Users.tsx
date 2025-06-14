import { useOrgContext } from "../../contexts/OrgContext";


export default function OrgUsers() {
    const { getOrgContext } = useOrgContext(); const orgProps = getOrgContext()

    return (
        <>
            {
                ['owner', 'admin'].includes(orgProps!.role)
                    ? modifyUsers()
                    : viewUsers()
            }
        </>
    )
}

function viewUsers() {
    return (
        <>a</>
    )
}

function modifyUsers() {
    return (
        <>b</>
    )
}