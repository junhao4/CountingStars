import './LogPage.css'
import { useOrgContext } from "../../../common/contexts/OrgContext.tsx"
import { useEffect, useState } from 'react'
import { fetchLogs, generateLogMessage, type LogFetch } from '../../../features/organization/log/api/LogApi.tsx'
<<<<<<< HEAD:src/pages/organization/log/Log.tsx
import LogRow from '../../../features/organization/log/componentss/LogRow.tsx'
import { Container, Paper, Typography } from '@mui/material'
import LogHeader from '../../../features/organization/log/componentss/LogHeader.tsx'
=======
>>>>>>> cc14f6b3cb5e4a0b63f7722fc6c3bcd74d089609:src/pages/organization/log/LogPage.tsx



export default function LogPage() {
    const { getOrgContext } = useOrgContext()
    const orgProps = getOrgContext()!

    const [logs, setLogs] = useState<LogFetch[]>([])



    useEffect(() => {
        fetchLogs(orgProps, setLogs)
    }, [])

   /* return (
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
    ) */
   return ( <>
         <Container>
            <Typography variant='h2' sx={{my : 2}}>
                Inventory Logs
            </Typography>
            <Typography variant='h6' sx={{my : 2, color : "grey", fontWeight : 400}}>
                View all recorded actions in your organization
            </Typography>
            <Paper>
                <LogHeader></LogHeader>
                {logs.map((log, index) => {
                        return (
                             <LogRow log={log} index={index + 1}></LogRow>
                        )
                    }
                )}
           
            </Paper>
            </Container>
        </>)
}