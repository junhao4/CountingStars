import { useEffect, useState } from "react";
import { useOrgContext } from "../../../../common/contexts/OrgContext";
import { fetchTotalQuantityLogs } from "../api/ChartsApi";

export function useTotalQuantityChartData( orgid : number ) {
    const { org } = useOrgContext();
    const [dataset, setData] = useState<{ date: Date; total: number; }[]>([]);

    useEffect(() => {
        const load = async () => {
            let total = 0;
            const result = [];
            const data = await fetchTotalQuantityLogs(orgid);

            for (const log of data!) {
                const date = new Date(log.created_at);
                const { typeString, metadata } = log;
                const meta = log.metadata as {
                    quantity?: number;
                    newQuantity?: number;
                    oldQuantity?: number;
                };
                let change = 0;
                if (typeString === "addItem") {
                    change = meta.quantity ?? 0;
                } else if (typeString === "removeItem") {
                    change = -(meta.quantity ?? 0);
                } else if (typeString === "updateQuantity") {
                    change = (meta.newQuantity ?? 0) - (meta.oldQuantity ?? 0);
                }

                total += change;
                result.push({ date, total });
            }
            setData(result)
        };
        load()
    }, [orgid]);

    return {dataset};
}
