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
                return (
                performerName +
                " has moved item " +
                item +
                " from " +
                metadata.oldLocation +
                " to " +
                metadata.newLocation
                )
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
  if (!(type in LOGS)) {
    console.warn("Unknown log type:", type, item);
  }
  const generator = LOGS[type].generateMessage;
  return generator(performerName, item, metadata);
}
//Convert user choice to database stored types
export const filterToType = {
  "Created" : ["addItem"],
  "Updated" : ["updateQuantity", "updateExpiry", "moveItem"],
  "Deleted" : ["removeItem"],
};

type filterType = "Created" | "Updated" | "Deleted";

//Add log to supabase
export async function addLog<Type extends LOGSTYPE> (
    organization_id: number,
    typeString: Type,
    performer_id: string,
    item_id: number,
    metadata: metadataType[Type]["metadata"]
) {
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



//Gets the logs from supabase
export const fetchLogs = async (
    org: Organization,
    setLogs: React.Dispatch<React.SetStateAction<LogFetchS[]>>,
    filter: filterType[]
) => {
    let query = supabase
        .from("Logs")
        .select(
            "id, Users!performer_id(name), Items!item_id(name), typeString, created_at, metadata"
        )
        .eq("organization_id", org.id)
        .order("id", { ascending: false })
        
        const typeStrings = filter.flatMap(label => filterToType[label] || []);

        if (filter.length > 0) {
            query = query.in("typeString", typeStrings)
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

