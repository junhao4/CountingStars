import type { AlertType } from "../../../common/contexts/AlertContext"
import supabase from "../../../helper/supabaseClient"
import type { OrganizationRolesType, Organization } from "../../../helper/types"
import { fetchOrganization, fetchOrgImage, fetchUserRole } from "../../organization/home/api/HomeApi"

export interface DashboardOrganizationFetch {
    id: number
    name: string
    role: OrganizationRolesType
    imageFile: string | null
    imageUrlBlob: string | null
}

// Fetches an array of Dashboard Organization cards
export const fetchDashboard = async (userId: string) => {

    const { data, error } = await supabase.from('users_organizations')
        .select(`organizationId:organization_id, role`)
        .eq('user_id', userId)

    console.log(data)
    if (error) {
        console.log(error.message)
        return []
    }

    const roles = await Promise.all(data.map(async d => {
        const res = await fetchOrganization(d.organizationId)
        if (res) {
            return { ...res, role: d.role as OrganizationRolesType }
        } else {
            return null
        }
    }))

    const filteredRoles = roles.filter(d => !!d)

    const images = await Promise.all(filteredRoles.map(async d => {
        if (d.imageFile) {
            const imageUrlBlob = await fetchOrgImage(d.imageFile)

            return { ...d, imageUrlBlob }
        } else {
            const imageUrlBlob = await fetchOrgImage("Stock Background.jpg")
            return { ...d, imageUrlBlob }
        }
    }))

    return images
}

// Transform organization data to include user role and imageUrlBlob
export const transformOrgDataToDashboardCard = async (userId: string, org: Organization) => {
    const role = await fetchUserRole(userId, org.id)
    if (!role) {
        console.log("Error: User not in organization")
        return null
    }

    const image = await fetchOrgImage(org.imageFile)

    return { ...org, imageUrlBlob: image, role: role as OrganizationRolesType }
}

// When the enter organization button is clicked, check for role access
export const enterOrg = (org: DashboardOrganizationFetch, createAlert: (arg0: AlertType, arg1: string) => void) => {
    if (org.role === 'pending') {
        createAlert('error', 'Your request to join this organization is still pending approval')
        return null
    }
    return org
}

// When the join organization button is clicked, add new 'pending' role
export const joinOrg = async (joinId: string, userId: string, createAlert: (arg0: AlertType, arg1: string) => void) => {

    var isNumber = true
    for (var i = 0; i < joinId.length; i++) {
        if (!(joinId.charAt(i) >= '0' && joinId.charAt(i) <= '9')) {
            isNumber = false
        }
    }
    if (!isNumber || joinId === '') {
        createAlert("warning", "Not a valid organization id number!")
        return null
    }
    const organization_id = Number.parseInt(joinId)

    const data = await supabase.from("users_organizations")
        .select("*")
        .eq("user_id", userId)
        .eq("organization_id", organization_id)
        .then(async res => {
            if (res.error) {
                console.log(res.error.message)
            } else if (res.data.length === 1) {
                createAlert('error', "Error: Already in organization or still pending approval!")
            } else {
                // Add the new organization to orgs.
                const { error } = await supabase.from("users_organizations")
                    .insert({ user_id: userId, organization_id, role: "pending" })
                if (error) {
                    console.log(error.message)
                } else {
                    const org = await fetchOrganization(organization_id)
                    if (org) {
                        const res = await transformOrgDataToDashboardCard(userId, { ...org, role: 'pending' })
                        return res
                    }
                    return null
                }
            }
            return null
        })
    return data
}

// Creates a new organization and inserts into supabase if valid
export const handleAddOrganization = async (userId: string, name: string, image: FileList | null, createAlert: (arg0: AlertType, arg1: string) => void) => {
    // Check that image size is < 2MB, type is correct, and that organization name is not empty
    if (image && image[0].size > 2097152) {
        createAlert("error", "Image size must be < 2MB!")
        return null
    }

    if (image && !(image[0].type === 'image/jpeg' || image[0].type === 'image/png')) {
        createAlert("error", "File type not accepted!")
        return null
    }

    if (name === '') {
        createAlert("error", "Organization name must not be empty!")
        return null
    }

    // Check that organization name is unique for the user
    const { data: org } = await supabase.from('Organizations')
        .select('id')
        .eq('name', name)

    if (org?.length !== 0) {
        createAlert("error", "You already have an organization with the same name. Please choose another name.")
        return null
    }

    image?.length === 1
        ? supabase.storage.from('organization-images').upload(image[0].name, image[0], {
            cacheControl: '3600',
            upsert: false
        }).then(res => { if (res.error) { createAlert("error", res.error.message) } })
        : null

    const { data, error } = await supabase.from('Organizations')
        .insert({ name, image_file: image?.[0].name })
        .select("*")
        .single()

    if (error) {
        createAlert("error", error.message)
        return null
    } else {
        const { error: error2 } = await supabase.from('users_organizations')
            .insert({ user_id: userId, organization_id: data.id, role: 'owner' })

        if (error2) {
            createAlert("error", error2.message)
            return null
        }
        else { createAlert('success', "Successfully created organization!")
            return {success: true}
         }
    }
}