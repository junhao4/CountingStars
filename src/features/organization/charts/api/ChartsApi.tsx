import supabase from "../../../../helper/supabaseClient";

export const fetchItemChartData = async (itemId: number, orgId: number) => {
    const { data, error } = await supabase
        .from("Logs")
        .select("typeString, metadata, created_at, Items(name)")
        .eq("item_id", itemId)
        .in("typeString", ["addItem", "removeItem", "updateQuantity"])
        .order("created_at", { ascending: true });

    if (error) {
        console.log(error);
    } else {
        console.log("DATA", data);
        return data;
    }
};

export const fetchTotalQuantityLogs = async (orgId: number) => {
    const { data, error } = await supabase
        .from("Logs")
        .select("typeString, metadata, created_at")
        .eq("organization_id", orgId)
        .in("typeString", ["addItem", "removeItem", "updateQuantity"])
        .order("created_at", { ascending: true })

    if (error) {
        console.error("Error", error)
        return
    }

    return data
};

export const fetchItemsInOrg = async (orgId: number) => {
    const { data, error } = await supabase
        .from("Items")
        .select("id, name, quantity")
        .eq("org_id", orgId)
        .eq("deleted", false)

    if (error) {
        console.error("Error", error)
        return
    }
    return data
};
