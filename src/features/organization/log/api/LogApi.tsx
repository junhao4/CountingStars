import type { Json } from "../../../../helper/supabase";
import supabase from "../../../../helper/supabaseClient";
import type { Organization } from "../../../../helper/types";

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

export type metadataType = {
    "addItem" :{
            metadata : {
                quantity : string
            }
    },
    "removeItem": {
        metadata: {

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
            itemName: string, categoryName: string
        }
    },
    "removeItemCategory": {
        metadata: {
            itemName: string, categoryName: string
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
                " to " +
                metadata.newLocation
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
        generateMessage: (performerName, _item, metadata) => {
            return (
                performerName +
                " has added the item " +
                metadata.itemName +
                " to category " +
                metadata.categoryName
            )
        }
    },
    removeItemCategory: {
        generateMessage: (performerName, _item, metadata) => {
            return (
                performerName +
                " has removed the item " +
                metadata.itemName +
                " from category " +
                metadata.categoryName
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
    "Created": ["addItem"],
    "Updated": ["updateQuantity", "updateExpiry", "moveItem"],
    "Deleted": ["removeItem"],
};

export type FilterType = "Created" | "Updated" | "Deleted";

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

