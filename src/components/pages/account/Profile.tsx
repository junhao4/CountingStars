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
import type { User } from "@supabase/supabase-js";
import { useMessageContext } from "../../contexts/MessageContext";

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
    const { session, nameRefresh, setNameRefresh } = useSessionContext();
    const { createMessage } = useMessageContext()

    const [username, setUsername] = useState<string | null>("");
    const [name, setName] = useState<string | null>("New User");
    const [profileUrl, setProfileUrl] = useState<string | null>("");
    const [img, setImg] = useState<string|undefined>();

    const handleFirstTimeUser = async (user: User | undefined) => {
        const { data } = await supabase
            .from('Users')
            .select()
            .eq('user_id', user!.id)
            .single()

        if (data) {
            // User exists already
        } else {
            const { error } = await supabase
                .from('Users')
                .insert({ user_id: user?.id, name: null, image_file: 'Default_pfp.jpg', email: user?.email })
                .select()

            if (error) {
                createMessage('error', error.message)
            }
        }

    }

    //Updates username
    const updateProfile = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { data, error } = await supabase
            .from("Users")
            .update({ name: username })
            .eq("user_id", session!.user.id)
            .select();

        if (data) {
            setName(username);
            createMessage('success', "Successfully set new username!")
            setNameRefresh(!nameRefresh)
        } else {
            createMessage('error', error.message);
        }
    };

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
        handleFirstTimeUser(session?.user)
        if (session?.user) {
            const fetchUser = async () => {
                const { data } = await supabase
                    .from("Users")
                    .select()
                    .eq("user_id", session!.user.id)
                    .single();

                setName(data!.name ?? "New User");
                setUsername(data!.name ?? "");
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
                        {name}
                    </Typography>
                    <img height={300} width={300} src={img}></img>
                    <form onSubmit={updateProfile}>
                        <Stack
                            spacing={2}
                            alignItems="center"
                            sx={{ mx: "auto", width: "300px" }}
                        >
                            <TextField
                                label="Username"
                                value={username ?? ""}
                                onChange={(e) => setUsername(e.target.value)}
                                fullWidth
                            />
                            <Button type="submit" variant="contained" fullWidth>
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
                    </form>
                </Stack>
            </Container>
        </>
    );
}

export default Profile;
