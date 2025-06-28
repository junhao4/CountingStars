import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { usePageTitleContext } from "../contexts/PageTitleContext";
import supabase from "../../helper/supabaseClient";
import { useSessionContext } from "../contexts/SessionContext";
import {
    Button,
    Card,
    CardMedia,
    styled,
    Container,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import type { User } from "@supabase/supabase-js";

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
    const [username, setUsername] = useState<string | null>("");
    const [name, setName] = useState<string | null>("New User");
    const [profileUrl, setProfileUrl] = useState<string | null>("");
    const [message, setMessage] = useState("");
    const [img, setImg] = useState("");
    const { session } = useSessionContext();

    const handleFirstTimeUser = async (user: User | undefined) => {
        const { data, error } = await supabase
            .from('Users')
            .select()
            .eq('user_id', user!.id)

        if (data!.length > 0) {
            console.log("user exists", data)
        } else {
            const { data, error } = await supabase
                .from('Users')
                .insert({ user_id: user?.id, name: null, image_file: 'Default_pfp.jpg', email: user?.email })
                .select()

            if (data) {
                console.log("User successfully added")
            } else {
                console.log(error.message)
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
            setMessage(username + " set as username");
            setName(username);
        } else {
            setMessage("error");
            console.log(error);
        }
    };

    //Updates Image
    const updateImage = async (e: ChangeEvent<HTMLInputElement>) => {
        console.log("Updating image");

        if (!e.target.files || e.target.files.length === 0) {
            setMessage("You must select an image to upload.");
            return;
        }

        const file = e.target.files[0];
        const fileExt = file.name.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        console.log("File", file.name, file.size, file.type);
        const { error } = await supabase.storage
            .from("profile-images")
            .upload(fileName, file);
        if (error) {
            alert("upload error");
            console.log(error.message);
            return;
        } else {
            console.log("uploaded img");
            //remove old image from storage
            console.log("old image", profileUrl);
            if (profileUrl && profileUrl !== "Default_pfp.jpg") {
                const { error } = await supabase.storage
                    .from("profile-images")
                    .remove([profileUrl]);
  
                if (error) {
                    console.log("fail to delete", error);
                }
            }
            await supabase
                .from("Users")
                .update({ image_file: fileName })
                .eq("user_id", session!.user.id)
                .then((res) => console.log(res.error));

            setProfileUrl(fileName);
        }
    };

    //Fetches preexisting user info
    useEffect(() => {
        handleFirstTimeUser(session?.user)
        console.log(session?.user.email);
        if (session?.user) {
            const fetchUser = async () => {
                const { data, error } = await supabase
                    .from("Users")
                    .select()
                    .eq("user_id", session!.user.id)
                    .single();

                setName(data!.name ?? "New User");
                setUsername(data!.name ?? "");
                console.log(data!.name);
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

        downloadImage();
    }, [profileUrl]);

    //Set header title to Login
    const { title, setTitle } = usePageTitleContext();

    useEffect(() => {
        console.log("Setting title to Profile");
        setTitle("Profile");
        console.log(title);
    }, []);
    //

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
                    <Card sx={{ width: "400px" }}>
                        <CardMedia sx={{ height: "300px" }} image={img} />
                    </Card>
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
                    <div>{message}</div>
                </Stack>
            </Container>
        </>
    );
}

export default Profile;
