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
                        <td>Type</td>
                        <td>JSON</td>
                    </tr>
                </thead>
                <tbody> 
                    {logs.map((log, index) => {
                        return (
                            <tr key={index}>
                                <td>{log.id}</td>
                                <td>{log.user_name}</td>
                                <td>{log.type}</td>
                                <td>{log.metadata?.toString()}</td>
                            </tr>)
                    })}
                </tbody>
            </table>
        </Box>
    )
}