import { Button } from "@mui/material";
import supabase from "../../../../helper/supabaseClient";
import { useOrgContext } from "../../../contexts/OrgContext";
import { useNavigate } from "react-router-dom";
import { useMessageContext } from "../../../contexts/MessageContext";


export default function OrgSettings() {
    const { getOrgContext } = useOrgContext()
    const orgProps = getOrgContext()!
    const { createMessage } = useMessageContext()
    const navigate = useNavigate()

    const handleDelete = async () => {
        await supabase.from("Organizations")
            .delete()
            .eq("id", orgProps.id)
            .then(res => {
                if (res.error) {
                    createMessage("failure", res.error.message)
                } else {
                    createMessage("success", "Successfully deleted organization!")
                    navigate('/dashboard')
                }
            })
    }

    return (
        <>
            <Button onClick={handleDelete}>Delete organization</Button>
        </>
    )
}