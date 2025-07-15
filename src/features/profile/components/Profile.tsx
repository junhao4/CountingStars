import { Stack, Typography, TextField, Button, styled } from "@mui/material";
import Container from "@mui/material/Container";
import { useEffect, useState, type ChangeEvent } from "react";
import { useAlertContext } from "../../../common/contexts/AlertContext";
import { useSessionContext, type ValidSession } from "../../../common/contexts/SessionContext";
import { updateProfileName, updateProfileImage, fetchProfileImage, downloadProfileImage } from "../api/ProfileApi";
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import ProfileInformationBox from "./ProfileInformationBox";
import ProfileUsernameBox from "./ProfileUsernameBox";
import { ThemeSettingsBox } from "../../theme/components/ThemeSettingsBox";


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
    const { user, setUser } = useSessionContext() as ValidSession
    const { createAlert } = useAlertContext()

    const [newUsername, setNewUsername] = useState<string>("");
    const [profileUrl, setProfileUrl] = useState<string | null>(null);
    const [img, setImg] = useState<string | undefined>();


    const onUpdateImage = async (e: ChangeEvent<HTMLInputElement>) => {
        const fileName = await updateProfileImage(e, user.id, profileUrl!, createAlert)
        setProfileUrl(fileName);
        createAlert("success", "Successfully set image")
    }

    const handleUpdateProfileName = async () => {
        await updateProfileName(user.id, newUsername)
        createAlert("success", "Successfully set new username!");
        setUser({...user, name: newUsername})
        
    }

    //Fetches user image file
    useEffect(() => {
        if (user) {
            fetchProfileImage(user.id).then(data => {
                data && (setProfileUrl(data.image_file || "Default_pfp.jpg"))
            })}
    }, [user]);

    //Downloads user image from storage
    useEffect(() => {
        if (profileUrl) {
            downloadProfileImage(profileUrl).then(data => {
                data && setImg(URL.createObjectURL(data))
            })
        }
    }, [profileUrl]);

    return (
         <>
        <Container sx={{ width : "60%"}}>
            <ProfileInformationBox img={img!} user={user} onUpdateImage={onUpdateImage} />
            <ProfileUsernameBox newUsername={newUsername} setNewUsername={setNewUsername} handleUpdateProfileName={handleUpdateProfileName}/>


            <ThemeSettingsBox />

        
            </Container>
        </>
    )
}