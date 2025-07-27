    import supabase from "../../../../helper/supabaseClient"
import { type Organization } from "../../../../helper/types"

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

export const fetchUsersNumber = async (org : Organization, setUsers : React.Dispatch<React.SetStateAction<number>>) => {
    const { data } = await supabase
      .from("users_organizations")
      .select("user_id")
      .eq("organization_id", org.id)
      .neq("role", 'pending')
      
    setUsers(data?.length!)
}

export const fetchItemsNumber = async (org : Organization, setItems : React.Dispatch<React.SetStateAction<number>>) => {
    const { data } = await supabase
      .from("Items")
      .select("quantity")
      .eq("org_id", org.id)
      .eq("deleted", false)
    
    if (data) {
    setItems(data!.map(x => x.quantity).reduce((x, y) => x + y, 0))
    }
}