import supabase from "../../../helper/supabaseClient"
import type { UserRoles } from "../../contexts/OrgContext"
import type { User } from "../../contexts/SessionContext"
import type { VariantType } from "../../contexts/MessageContext"
import { fetchOrganization, fetchOrgImage, fetchUserRole, type Organization } from "../organization/OrgController"

export interface DashboardOrganizationFetch {
    id: number
    name: string
    role: UserRoles
    imageFile: string | null
    imageUrlBlob: string | null
}

// Fetches an array of Dashboard Organization cards
export const fetchDashboard = async (user: User) => {
    const { data, error } = await supabase.from('users_organizations')
        .select(`organization_id, role`)
        .eq('user_id', user.user_id)

    if (error) {
        console.log(error.message)
        return null
    }

    const roles = await Promise.all(data.map(async d => {
        const res = await fetchOrganization(d.organization_id)
        if (res) {
            return { ...res, role: d.role as UserRoles }
        } else {
            return null
        }
    }))

    const filteredRoles = roles.filter(d => !!d)

    const images = await Promise.all(filteredRoles.map(async d => {
        if (d.imageFile) {
            const image = await fetchOrgImage(d.imageFile)

            return { ...d, imageUrlBlob: image }
        } else {
            const image = await fetchOrgImage("Stock Background.jpg")
            return { ...d, imageUrlBlob: image }
        }
    }))

    return images
}

// Transform organization data to include user role and imageUrlBlob
export const transformOrgDataToDashboardCard = async (user_id: string, org: Organization) => {
    const role = await fetchUserRole(user_id, org.id)
    if (!role) {
        return null
    }

    const image = await fetchOrgImage(org.imageFile)

    return { ...org, imageUrlBlob: image, role: role as UserRoles }
}

// When the enter organization button is clicked, check for role access
export const enterOrg = (org: DashboardOrganizationFetch, createMessage: (arg0: VariantType, arg1: string) => void) => {
    if (org.role === 'pending') {
        createMessage('error', 'Your request to join this organization is still pending approval')
        return null
    }
    return org
}

// When the join organization button is clicked, add new 'pending' role
export const joinOrg = async (joinId: string, user_id: string,  createMessage: (arg0: VariantType, arg1: string) => void) => {
    var isNumber = true
    for (var i = 0; i < joinId.length; i++) {
        if (!(joinId.charAt(i) >= '0' && joinId.charAt(i) <= '9')) {
            isNumber = false
        }
    }
    if (!isNumber || joinId === '') {
        createMessage("warning", "Not a valid organization id number!")
        return null
    }
    const organization_id = Number.parseInt(joinId)

    const data = await supabase.from("users_organizations")
        .select("")
        .eq("user_id", user_id)
        .eq("organization_id", organization_id)
        .then(async res => {
            if (res.error) {
                console.log(res.error.message)
            } else if (res.data.length === 1) {
                createMessage('error', "Error: Already in organization or still pending approval!")
            } else {

                // Add the new organization to orgs.
                const { error } = await supabase.from("users_organizations")
                    .insert({ user_id, organization_id, role: "pending" })
                if (error) {
                    console.log(error.message)
                } else {
                    const d = await fetchOrganization(organization_id)
                    if (d) {
                        const res = await transformOrgDataToDashboardCard(user_id, d)
                        return res
                    }
                    return null
                }
            }
            return null
        })
    return data
}