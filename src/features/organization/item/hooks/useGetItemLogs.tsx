import { useEffect, useState } from "react"
import type { LogFetch } from "../../log/api/LogApi"
import { fetchItemLogs } from "../api/ItemApi"


export default function useGetItemLogs(itemId: number) {
    const [logs, setLogs] = useState<LogFetch[]>([])

    useEffect(() => {
        fetchItemLogs(itemId)
            .then(data => setLogs(data))
    }, [])

    return { logs }
}