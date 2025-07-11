import supabase from "../../../../helper/supabaseClient";
import type { ItemWithCategories } from "../../../../helper/types";


export const fetchItem = async (organizationId: number, itemId: number) => {
    const { data, error } = await supabase
        .from("Items")
        .select(
            `id, name, quantity, description, lastModified:last_modified, expiryDate:expiry_date, 
            categories:Categories(id, name, createdAt:created_at)`
        )
        .eq("org_id", organizationId)
        .eq("id", itemId)
        .eq('deleted', false)
        .maybeSingle()
    if (error) {
        console.log(error.message);
        return null;
    } else if (!data) {
        return null;
    }

    const fixDate = {...data, expiryDate: data.expiryDate ? data.expiryDate : "-",}

    return fixDate as ItemWithCategories
}