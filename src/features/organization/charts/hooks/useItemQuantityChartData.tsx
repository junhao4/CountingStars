import { useEffect, useState } from "react";
import { useOrgContext } from "../../../../common/contexts/OrgContext";
import { fetchItemChartData } from "../api/ChartsApi";
import { useAlertContext } from "../../../../common/contexts/AlertContext";

type ChartPoint = {
    date: Date;
    [itemId: string]: number | Date | null;
};

type ChartSeries = {
    dataKey: string;
    label: string;
    curve: "linear";
    connectNulls: boolean;
};

function useItemQuantityChartData(itemIds: number[]) {
    const { org } = useOrgContext();
    const { createAlert } = useAlertContext();
    const [dataset, setDataset] = useState<ChartPoint[]>([]);
    const [series, setSeries] = useState<ChartSeries[]>([]);

    useEffect(() => {
        const load = async () => {
            const data = await Promise.all(
                itemIds.map((itemId) => fetchItemChartData(itemId, org?.id!))
            );

            const idNameMap = new Map<number, string>();
            const points = [];
            const lastKnownStock = new Map<number, number>();

            for (let i = 0; i < itemIds.length; i++) {
                const itemId = itemIds[i];
                const logs = data[i];

                if (!logs) {
                    createAlert(
                        "error",
                        "Item: " +
                            idNameMap.get(itemId) +
                            "ID: " +
                            { itemId } +
                            " has no data."
                    );
                    continue;
                }

                for (const log of logs) {
                    const date = new Date(log.created_at);
                    const meta = log.metadata as {
                        quantity?: number;
                        newQuantity?: number;
                        oldQuantity?: number;
                    };
                    let stock = 0;
                    const { typeString } = log;

                    if (typeString === "addItem") {
                        stock = meta.quantity!;
                    } else if (typeString === "removeItem") {
                        stock = 0;
                    } else if (typeString === "updateQuantity") {
                        stock = meta.newQuantity!;
                    }
                    const name = log.Items.name;
                    idNameMap.set(itemId, name);

                    const point: ChartPoint = {
                        date,
                        [String(itemId)]: stock,
                    };

                    lastKnownStock.set(itemId, stock);

                    itemIds.forEach((id) => {
                        const key = String(id);
                        if (!(key in point)) {
                            point[key] = null;
                        }
                    });

                    points.push(point);
                }
            }
            const dataset = points.sort(
                (a, b) => a.date.getTime() - b.date.getTime()
            );

            const lastPoint = dataset[dataset.length - 1];
            itemIds.forEach((id) => {
                const key = String(id);
                if (lastPoint[key] === null) {
                    const fallback = lastKnownStock.get(id);
                    if (typeof fallback === "number") {
                        lastPoint[key] = fallback;
                    }
                }
            });

            const series: ChartSeries[] = itemIds.map((id) => ({
                dataKey: String(id),
                label: idNameMap.get(id)!,
                curve: "linear",
                connectNulls: true,
            }));

            setDataset(dataset);
            setSeries(series);
        };

        load();
    }, [itemIds]);

    return { dataset, series };
}

export default useItemQuantityChartData;
