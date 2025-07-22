import { Box } from "@mui/material"
import useGetItemLogs from "../hooks/useGetItemLogs"


export default function ItemLogs({ itemId }: { itemId: number }) {
    const { logs } = useGetItemLogs(itemId)

    return (
        <Box sx={{display:'flex', justifyContent:'center'}}>
            <table>
                <thead>
                    <tr>
                        <td>Id</td>
                        <td>Performer</td>
                        <td>Message</td>
                        <td>Date</td>
                    </tr>
                </thead>
                <tbody> 
                    {logs.map((log, index) => {
                        return (
                            <tr key={index}>
                                <td>{log.id}</td>
                                <td>{log.user_name}</td>
                                <td>{log.type}</td>
                                <td>{new Date(log.created_at).toDateString()}</td>
                            </tr>)
                    })}
                </tbody>
            </table>
        </Box>
    )
}