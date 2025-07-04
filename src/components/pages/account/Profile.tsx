import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { usePageTitleContext } from "../../contexts/PageTitleContext";
import supabase from "../../../helper/supabaseClient";
import { useSessionContext } from "../../contexts/SessionContext";
import {
    Button,
    styled,
    Container,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useMessageContext } from "../../contexts/MessageContext";
import { handleFirstTimeUser, updateProfile } from "./AccountController";


const VisuallyHiddenInput = styled("input")({
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

function Profile() {
    const { session, user, setUser } = useSessionContext()!
    if (session === null || user === null) {
        throw new Error("")
    }
    const { createMessage } = useMessageContext()

    const [newUsername, setNewUsername] = useState<string>("");
    const [profileUrl, setProfileUrl] = useState<string | null>(null);
    const [img, setImg] = useState<string | undefined>();


    //Updates Image
    const updateImage = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            createMessage('error', "You must select an image to upload.")
            return
        }

        const file = e.target.files[0];
        const fileExt = file.name.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        // console.log("File", file.name, file.size, file.type);
        const { error } = await supabase.storage
            .from("profile-images")
            .upload(fileName, file);
        if (error) {
            createMessage('error', error.message);
            return;
        } else {
            //remove old image from storage
            if (profileUrl && profileUrl !== "Default_pfp.jpg") {
                const { error } = await supabase.storage
                    .from("profile-images")
                    .remove([profileUrl]);

                if (error) {
                    createMessage('error', "Failed to delete old image: " + error.message);
                }
            }
            await supabase
                .from("Users")
                .update({ image_file: fileName })
                .eq("user_id", session!.user.id)
                .then((res) => { if (res.error) createMessage('error', res.error.message) });

            setProfileUrl(fileName);
        }
    };

    //Fetches preexisting user info
    useEffect(() => {
        // Sets user name to default, profile photo to default
        handleFirstTimeUser(session.user.id, session.user.email!)

        if (session?.user) {
            const fetchUser = async () => {
                const { data } = await supabase
                    .from("Users")
                    .select()
                    .eq("user_id", session!.user.id)
                    .single();

                setProfileUrl(data!.image_file);
            };

            fetchUser();
        }
    }, [session]);

    //Downloads user image from storage
    useEffect(() => {
        const downloadImage = async () => {
            const { data, error } = await supabase.storage
                .from("profile-images")
                .download(profileUrl!);
            if (error) {
                console.error("Error downloading image:", error.message);
            } else {
                const url = URL.createObjectURL(data);
                setImg(url);
            }
        };

        if (profileUrl) {
            downloadImage();
        }
    }, [profileUrl]);

    //Set header title to Login
    const { setTitle } = usePageTitleContext();

    useEffect(() => {
        setTitle("Profile");
    }, []);

    return (
        <>
            <Container maxWidth="xl" sx={{ mt: 4 }}>
                <Stack spacing={3} alignItems="center">
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 600,
                            mt: 2,
                            mb: 1,
                            color: "text.primary",
                        }}
                    >
                        {user.name}
                    </Typography>
                    <img height={300} width={300} src={img}></img>
                    <Stack
                        spacing={2}
                        alignItems="center"
                        sx={{ mx: "auto", width: "300px" }}
                    >
                        <TextField
                            label="Username"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            fullWidth
                        />
                        <Button onClick={() => updateProfile({
                            newName: newUsername, user,
                            setUser, createMessage
                        })} variant="contained" fullWidth>
                            Save
                        </Button>

                        <Button
                            component="label"
                            variant="outlined"
                            color="secondary"
                            startIcon={<CloudUploadIcon />}
                            fullWidth
                        >
                            Upload Profile Image
                            <VisuallyHiddenInput
                                type="file"
                                onChange={updateImage}
                            />
                        </Button>
                    </Stack>
                </Stack>
            </Container>
        </>
    );
}

export default Profile;
