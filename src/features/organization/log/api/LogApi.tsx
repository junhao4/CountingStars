
import type { Json } from "../../../../helper/supabase";
import supabase from "../../../../helper/supabaseClient";
import type { Organization, UserOrganization } from "../../../../helper/types";

export interface LogFetch {
    id: number;
    user_name: string;
    item_name: string;
    type: number | null;
    created_at: string;
    metadata: Json;
}

export interface LogFetchS {
    id: number;
    user_name: string;
    item_name: string;
    typeString: string | null;
    created_at: string;
    metadata: Json;
}


export type LOGSTYPE = 
    | "addItem"
    | "removeItem"
    | "moveItem"
    | "updateQuantity"
    | "updateExpiry"

export type metadataType = {
    "addItem" :{
            metadata : {
                
            }
    },
    "removeItem" :{
            metadata : {
                
            }
    },
    "moveItem" :{
            metadata : {
                newLocation : string, oldLocation : string
            }
    },
    "updateQuantity" :{
            metadata : {
                newQuantity : number, oldQuantity : number
            }
    }
    "updateExpiry" :{
            metadata : {
                newExpiry : string, oldExpiry : string
            }
    },
} 

type MessageCheck<Key extends LOGSTYPE> =
     (performerName : string, item : string, metadata : metadataType[Key]["metadata"]) => string 

type LogsWithMetadata = {
    [L in LOGSTYPE]: {
        generateMessage: MessageCheck<L>
    }
}

export const LOGS : LogsWithMetadata = {
        addItem: {
            generateMessage : (performerName, item, _metadata) => {
                return performerName + " has added a new item " + item;
            }
        },
        removeItem: {
            generateMessage : (performerName, item, _metadata) => {
             return performerName + " has deleted the item " + item;
            }
            
        },
        moveItem: {
            generateMessage : (performerName, item, metadata) => {
                return ""
            }
        },
        updateQuantity: {
            generateMessage :  (performerName, item, metadata) => {
                return (
                performerName +
                " has updated the quantity of " +
                item +
                " from " +
                metadata.oldQuantity +
                " to " +
                metadata.newQuantity
                )
            }
        },
        updateExpiry: {
            generateMessage :  (performerName, item, metadata) => {
                return (
                    performerName +
                    " has updated the expiration date of " +
                    item +
                    " from " +
                    metadata.oldExpiry +
                    " to " +
                    metadata.newExpiry
                )
            }
        }
    
} as const satisfies LogsWithMetadata

export function generateLogMessageNew<Type extends LOGSTYPE>(
  type: Type,
  performerName: string,
  item: string,
  metadata: metadataType[Type]["metadata"]
) {
  const generator = LOGS[type].generateMessage;
  return generator(performerName, item, metadata);
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
    typeString: string | null,
    performer_id: string,
    item_id: number,
    metadata: Json
) => {
    return await supabase
        .from("Logs")
        .insert({ typeString, performer_id, item_id, metadata, organization_id })
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
    org: Organization,
    setLogs: React.Dispatch<React.SetStateAction<LogFetchS[]>>,
    filter: string[]
) => {
    let query = supabase
        .from("Logs")
        .select(
            "id, Users!performer_id(name), Items!item_id(name), typeString, created_at, metadata"
        )
        .eq("organization_id", org.id)
        .order("id", { ascending: false })

        if (filter.length > 0) {
            query = query.in("typeString", filter)
        }
        
        const res = await query
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
         
};

