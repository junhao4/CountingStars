import supabase from "../../../helper/supabaseClient"

export type Organization = {
    id: number
    name: string
    imageFile: string | null
}

export const fetchOrganization = async (org: number) => {
    const { data, error } = await supabase.from("Organizations")
            .select("id, name, imageFile:image_file")
            .eq("id", org)
            .single()

        if (error) {
            console.log(error.message)
            return null
        }

        return data
}

export const fetchUserRole = async (user_id: string, org_id: number) => {
    const { data, error } = await supabase.from("users_organizations")
        .select("role")
        .eq("user_id", user_id)
        .eq('org_id', org_id)
        .single()

    if (error) {
        console.log(error.message)
        return null
    }
    return data.role
}

// After retrieving organization data, this function is called to retrieve the image blob and returns an URL to it.
export const fetchOrgImage = async (fileName: string | null) => {
    if (fileName === null) {
        fileName = 'Stock Background.jpg'
    }
    const { data, error } = await supabase.storage.from('organization-images')
        .download(fileName)
    if (error) {
        console.log(error.message)
        return null
    }
    return URL.createObjectURL(data)
}