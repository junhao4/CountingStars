import { useEffect, useState } from "react";
import { fetchItemsInOrg } from "../api/ChartsApi";

function useItemInOrgChartData(orgId: number) {
    const [dataset, setDataset] = useState<
        { name: string; quantity: number }[]
    >([]);

    useEffect(() => {
        const load = async () => {
            const data = await fetchItemsInOrg(orgId);
            if (!data) return;
            setDataset(
                data.map((item) => ({
                    name: item.name,
                    quantity: item.quantity,
                }))
            );
        };
        load();
    }, [orgId]);

    return { dataset };
}

export default useItemInOrgChartData;
