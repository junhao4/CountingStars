import type { Json } from "../../../../helper/supabase";
import supabase from "../../../../helper/supabaseClient";

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
    typeString: string;
    created_at: string;
    metadata: Json;
}


export type LOGSTYPE =
    | "addItem"
    | "removeItem"
    | "moveItem"
    | "updateQuantity"
    | "updateExpiry"
    | "addItemCategory"
    | "removeItemCategory"
    | "changeItemName"

    export type FilterType = "Created" | "Updated" | "Deleted";

    //Convert user choice to database stored types
export const filterToType = {
    "Created": ["addItem"],
    "Updated": ["updateQuantity", "updateExpiry", "moveItem", "changeItemName",
                "addItemCategory", "removeItemCategory"
    ],
    "Deleted": ["removeItem"],
};



export type metadataType = {
    "addItem" :{
        metadata : {
            quantity : number
        }
    },
    "removeItem": {
        metadata: {
            quantity : number
        }
    },
    "moveItem": {
        metadata: {
            newLocation: string, oldLocation: string
        }
    },
    "updateQuantity": {
        metadata: {
            newQuantity: number, oldQuantity: number
        }
    }
    "updateExpiry": {
        metadata: {
            newExpiry: string, oldExpiry: string
        }
    },
    "addItemCategory": {
        metadata: {
          categoryName: string
        }
    },
    "removeItemCategory": {
        metadata: {
           categoryName: string
        }
    },
    "changeItemName": {
        metadata: {
            newName: string, oldName: string
        }
    }
}

type MessageCheck<Key extends LOGSTYPE> =
    (performerName: string, item: string, metadata: metadataType[Key]["metadata"]) => string

type LogsWithMetadata = {
    [L in LOGSTYPE]: {
        generateMessage: MessageCheck<L>
    }
}

export const LOGS: LogsWithMetadata = {
    addItem: {
        generateMessage: (performerName, item, _metadata) => {
            return performerName + " has added a new item " + item;
        }
    },
    removeItem: {
        generateMessage: (performerName, item, _metadata) => {
            return performerName + " has deleted the item " + item;
        }

    },
    moveItem: {
        generateMessage: (performerName, item, metadata) => {
            return (
                performerName +
                " has moved item " +
                item +
                " from " +
                metadata.oldLocation +
                " folder to " +
                metadata.newLocation +
                " folder"
            )
        }
    },
    updateQuantity: {
        generateMessage: (performerName, item, metadata) => {
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
        generateMessage: (performerName, item, metadata) => {
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
    },
    addItemCategory: {
        generateMessage: (performerName, item, metadata) => {
            return (
                performerName +
                " has added the item " +
                item +
                " to category " +
                metadata.categoryName
            )
        }
    },
    removeItemCategory: {
        generateMessage: (performerName, item, metadata) => {
            return (
                performerName +
                " has removed the item " +
                item +
                " from category " +
                metadata.categoryName
            )
        }
    },
    changeItemName: {
        generateMessage: (performerName, _item, metadata) => {
            return (
                performerName +
                " has changed the name of the item from " +
                metadata.oldName +
                " to " +
                metadata.newName
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


//Add log to supabase
export async function addLog<Type extends LOGSTYPE>(
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
                return false
            }
            else return true;
        });
};



//Gets the logs from supabase
export const fetchLogs = async (organizationId: number) => {
    const { data, error } = await supabase
        .from("Logs")
        .select(
            "id, Users!performer_id(name), Items!item_id(name), typeString, created_at, metadata"
        )
        .eq("organization_id", organizationId)
        .order("id", { ascending: false })

    if (error) {
        console.log(error.message)
        return "logError"
    }
    return data
}

