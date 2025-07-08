import type { Json } from "../../../helper/supabase";
import supabase from "../../../helper/supabaseClient";
import type { AlertType } from "../../../common/contexts/AlertContext";
import type { OrgProps } from "../../../common/contexts/OrgContext";

export interface LogFetch {
    id: number;
    user_name: string;
    item_name: string;
    type: number;
    created_at: string;
    metadata: Json;
}

//Possible types of logs
export const LogTypes = {
    INSERT_NEW: 1,
    UPDATE_QUANTITY: 2,
    UPDATE_EXPIRATION: 3,
    DELETE: 4,
};

//Add log to supabase
export const addLog = async (
    organization_id: number,
    type: number,
    performer_id: string,
    item_id: number,
    metadata: Json
) => {
    return await supabase
        .from("Logs")
        .insert({ type, performer_id, item_id, metadata, organization_id })
        .then((res) => {
            if (res.error) { 
                console.log(res.error.message)
                return null
            }
            else return true;
        });
};

//Creates the actual message to be displayed using ids
export const generateLogMessage = (
    type: number,
    performer_name: string,
    item_name: string,
    metadata: Json
) => {
    switch (type) {
        // Insert new item
        case 1:
            return performer_name + " has added a new item " + item_name;

        // Updated item quantity
        case 2:
            metadata = metadata as { old_value: string; new_value: string };
            return (
                performer_name +
                " has updated the quantity of " +
                item_name +
                " from " +
                metadata.old_value +
                " to " +
                metadata.new_value
            );

        // Updated item expiration date
        case 3:
            return (
                performer_name +
                " has updated the expiration date of " +
                item_name
            );

        // Deleted item
        case 4:
            return performer_name + " has deleted the item " + item_name;

        default:
            return "Unknown log type";
    }
};

//Gets the logs from supabase
export const fetchLogs = async (
    orgProps: OrgProps,
    setLogs: React.Dispatch<React.SetStateAction<LogFetch[]>>
) => {
    await supabase
        .from("Logs")
        .select(
            "id, Users!performer_id(name), Items!item_id(name), type, created_at, metadata"
        )
        .eq("organization_id", orgProps.id)
        .order("id", { ascending: false })
        .then((res) => {
            if (res.error) console.log(res.error.message);
            else
                setLogs(
                    res.data.map((log) => {
                        return {
                            ...log,
                            user_name: log.Users.name || "DELETED USER",
                            item_name: log.Items?.name,
                        };
                    })
                );
        });
};
