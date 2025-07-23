import { useEffect, useState } from "react";
import { useOrgContext } from "../../../../common/contexts/OrgContext";
import { fetchItemChartData } from "../api/ChartsApi";
import { useAlertContext } from "../../../../common/contexts/AlertContext";

type ChartPoint = {
    date: Date;
    stock: number;
    name : string
};

function useItemQuantityChartData(itemId: number) {
    const { org } = useOrgContext();
    const [data, setData] = useState<ChartPoint[]>([]);
    const { createAlert } = useAlertContext();

    useEffect(() => {
        const load = async () => {
            const data = await fetchItemChartData(itemId, org?.id!);
            if (!data) {
                createAlert(
                    "error",
                    "This item does not exist in your inventory"
                );
            } else {
                const result = [];
                for (const log of data) {
                    const date = new Date(log.created_at);
                    const meta = log.metadata as { quantity?: number; newQuantity?: number; oldQuantity?: number };
                    let stock = 0;
                    const {typeString} = log;
                    if (typeString === "addItem") {
                        stock = meta.quantity!
                    } else if (typeString === "removeItem") {
                        stock = 0;
                    } else if (typeString === "updateQuantity") {
                        stock = meta.newQuantity!
                    }
                    const name = log.Items.name
                    result.push({ date, stock, name });
                }
                setData(result);
                console.log(result)
            }
            
        };
        load()
    }, []);

    return data;
}

export default useItemQuantityChartData;
