import supabase from "../../../../helper/supabaseClient";

export const fetchItemChartData = async (itemId : number, orgId : number) => {
    const { data, error } = await supabase
        .from("Logs")
        .select("typeString, metadata, created_at, Items(name)")
        .eq("item_id", itemId)
        .order("created_at", { ascending: true });
  

    if (error) {
        console.log(error)
    } else {
        console.log("DATA",data)
        return data
    }

}

