import type { OrgProps } from "../../../../common/contexts/OrgContext"
import supabase from "../../../../helper/supabaseClient"
import { OrganizationRoles, type OrganizationRolesType } from "../../../../helper/types"

export const fetchOrganization = async (organizationId: number) => {
    const { data, error } = await supabase.from("Organizations")
        .select("id, name, imageFile:image_file")
        .eq("id", organizationId)
        .single()

    if (error) {
        console.log(error.message)
        return null
    }

    return { ...data, imageFile: data.imageFile || "Stock Background.jpg" }
}

export const fetchUserRole = async (userId: string, org_id: number) => {
    const { data, error } = await supabase.from("users_organizations")
        .select("role")
        .eq("user_id", userId)
        .eq('org_id', org_id)
        .single()

    if (error) {
        console.log(error.message)
        return null
    } else if (!OrganizationRoles.includes(data.role as OrganizationRolesType)) {
        throw new Error("Invalid role")
    }

    return data.role as OrganizationRolesType
}

// After retrieving organization data, this function is called to retrieve the image blob and returns an URL to it.
export const fetchOrgImage = async (fileName: string | null) => {
    if (fileName === null) {
        fileName = 'Stock Background.jpg'
    }
    console.log(1)
    const { data, error } = await supabase.storage.from('organization-images')
        .download(fileName)
    if (error) {
        console.log(error)
        return null
    }
    return URL.createObjectURL(data)
}

export const fetchUsersNumber = async (orgProps : OrgProps, setUsers : React.Dispatch<React.SetStateAction<number>>) => {
    const { data } = await supabase
      .from("users_organizations")
      .select("user_id")
      .eq("organization_id", orgProps.id)
       console.log(data)
    setUsers(data?.length!)
}

export const fetchItemsNumber = async (orgProps : OrgProps, setItems : React.Dispatch<React.SetStateAction<number>>) => {
    const { data } = await supabase
      .from("Items")
      .select("quantity")
      .eq("org_id", orgProps.id)
      .eq("deleted", false)
    
    if (data) {
    console.log(data)
    setItems(data!.map(x => x.quantity).reduce((x, y) => x + y))
    }
}