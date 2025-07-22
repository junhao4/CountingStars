import supabase from "../../../../helper/supabaseClient"



const getItemChartData = async (itemId : number) => {
    const { data, error } = await supabase
        .from()
}