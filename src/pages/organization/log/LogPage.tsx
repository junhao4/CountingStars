import './LogPage.css'
import { useOrgContext, type ValidOrg } from "../../../common/contexts/OrgContext.tsx"
import { useEffect, useState } from 'react'
import { fetchLogs, generateLogMessage, type LogFetch } from '../../../features/organization/log/api/LogApi.tsx'



export default function LogPage() {
    const { org } = useOrgContext() as ValidOrg

    const [logs, setLogs] = useState<LogFetch[]>([])



    useEffect(() => {
        fetchLogs(org, setLogs)
    }, [])

    return (
        <>
            <table className='log-table'>
                <thead className='log-table-header log-table-row'>
                    <tr>
                        <td>Index</td>
                        <td>Type</td>
                        <td>Date</td>
                    </tr>
                </thead>
                <tbody className='log-table-body log-table-row'>
                    {logs.map((log, index) => {
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{generateLogMessage(log.type, log.user_name, log.item_name, log.metadata)}</td>
                                <td>{new Date(log.created_at).toTimeString()}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </>
    )
}