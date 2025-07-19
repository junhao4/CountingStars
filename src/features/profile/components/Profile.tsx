import { styled, Box } from "@mui/material";
import Container from "@mui/material/Container";
import { useEffect, type ChangeEvent } from "react";
import { useAlertContext } from "../../../common/contexts/AlertContext";
import { useSessionContext, type ValidSession } from "../../../common/contexts/SessionContext";
import { updateProfileImage, fetchProfileImage } from "../api/ProfileApi";
import ProfileInformationBox from "./ProfileInformationBox";
import ProfileUsernameBox from "./ProfileUsernameBox";
import { ThemeSettingsBox } from "../../theme/components/ThemeSettingsBox";
import { validateImageFile } from "../../../common/functions/File";
import { useProfileContext } from "../../../common/contexts/ProfileContext";


export const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
});


export default function Profile() {
    const { user } = useSessionContext() as ValidSession
    const { createAlert } = useAlertContext()
    const { fileName, blobUrl, setFileName } = useProfileContext()

    const onUpdateImage = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (!validateImageFile(file)) {

                return
            }
            const newFileName = await updateProfileImage(file, user.id, fileName!)
            setFileName(newFileName);

            createAlert("success", "Successfully set image")
        }
    }

    useEffect(() => {
        fetchProfileImage(user.id).then(data => (setFileName(data || "Default_pfp.jpg")))
    }, [])

return (
    <>
        <Container sx={{ width: "60%" }}>
            <ProfileInformationBox img={blobUrl!} user={user} onUpdateImage={onUpdateImage} />
            <ProfileUsernameBox />


            <ThemeSettingsBox />
            <Box sx={{ mb: 3 }}></Box>

        </Container>
    </>
)
}