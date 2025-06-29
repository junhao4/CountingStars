import './Log.css'
import { useOrgContext } from "../../../contexts/OrgContext"
import supabase from '../../../../helper/supabaseClient'
import { useMessageContext } from '../../../contexts/MessageContext'
import { useEffect, useState } from 'react'
import type { Json } from '../../../../helper/supabase.ts'

export const LogTypes = {
    "INSERT_NEW": 1,
    "UPDATE_QUANTITY": 2,
    "UPDATE_EXPIRATION": 3,
    "DELETE": 4,
}

interface LogFetch {
    id: number,
    user_name: string,
    item_name: string,
    type: number,
    created_at: string,
    metadata: Json
}

export async function addLog(organization_id: number, type: number, performer_id: string, item_id: number, metadata: Json) {
    return await supabase.from("Logs")
        .insert({type, performer_id, item_id, metadata, organization_id})
        .then(res => {
            if (res.error) return res.error.message
            else return null
        })
}

const generateLogMessage = (type: number, performer_name: string, item_name: string, metadata: Json) => {
    switch (type) {
        // Insert new item
        case 1:
            return performer_name + " has added a new item " + item_name

        // Updated item quantity
        case 2:
            metadata = metadata as {old_value: string, new_value: string}
            return performer_name + " has updated the quantity of " + item_name + " from "
                + metadata.old_value + " to " + metadata.new_value

        // Updated item expiration date
        case 3:
            return performer_name + " has updated the expiration date of " + item_name

        // Deleted item
        case 4:
            return performer_name + " has deleted the item " + item_name

        default:
            return "Unknown log type"
    }

}

export default function OrgLog() {
    const { getOrgContext } = useOrgContext()
    const orgProps = getOrgContext()!
    const { createMessage } = useMessageContext()

    const [logs, setLogs] = useState<LogFetch[]>([])

    const fetchLogs = async () => {
        await supabase.from('Logs')
            .select('id, Users!performer_id(name), Items!item_id(name), type, created_at, metadata')
            .eq('organization_id', orgProps.id)
            .order('id', {ascending : false})
            .then(res => {
                if (res.error) createMessage('error', res.error.message)
                else setLogs(res.data.map(log => {
                    return {
                        ...log, user_name: log.Users.name || 'DELETED USER',
                        item_name: log.Items?.name,
                    }
                }))
            })
    }

    useEffect(() => {
        fetchLogs()
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