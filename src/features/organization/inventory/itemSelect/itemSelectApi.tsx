import supabase from "../../../../helper/supabaseClient"
import type { Item } from "../../../../helper/types";

type SupabaseItem = {
    created_at: string;
    deleted: boolean;
    description: string;
    expiry_date: string | null;
    folder_id: number | null;
    id: number;
    image_file: string;
    last_modified: string;
    name: string;
    org_id: number;
    quantity: number;
}

const transformSupabaseItem = (item: SupabaseItem) => {
    return {...item, expiryDate: item.expiry_date, lastModified: item.last_modified } as Item
}

export const fetchItemList = async (organizationId: number) => {
    const { data, error } = await supabase.from('Items')
        .select("*")
        .match({org_id: organizationId, deleted: false})

    if (error) {
        console.log(error.message)
        return "itemError"
    }

    return data.map(transformSupabaseItem)
}