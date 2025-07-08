import type { ChangeEvent } from "react";
import type { AlertType } from "../../../common/contexts/AlertContext";
import supabase from "../../../helper/supabaseClient";

export const fetchImageFile = async (userId: string) => {
    const { data, error } = await supabase
        .from("Users")
        .select("image_file")
        .eq("user_id", userId)
        .single();
    if (error) {
        console.log(error.message)
        return null
    }
    return data
};

// Download profile image of user
export const downloadProfileImage = async (profileUrl: string) => {
    const { data, error } = await supabase.storage
        .from("profile-images")
        .download(profileUrl);
    if (error) {
        console.error("Error downloading image:", error.message)
        return null
    } else {
        return data
    }
}

// Updates profile name of user
export const updateProfileName = async (userId: string, newName: string) => {
    const { data, error } = await supabase
        .from("Users")
        .update({ name: newName })
        .eq("user_id", userId)
        .select();

    if (error) {
        console.log("error", error.message);
    }
};

// Updates profile image of user
export const updateProfileImage = async (e: ChangeEvent<HTMLInputElement>,
    userId: string, profileUrl: string, createAlert: (arg0: AlertType, arg1: string) => void) => {
    if (!e.target.files || e.target.files.length === 0) {
        createAlert('error', "You must select an image to upload.")
        return profileUrl
    }

    const file = e.target.files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    // console.log("File", file.name, file.size, file.type);
    const { error } = await supabase.storage
        .from("profile-images")
        .upload(fileName, file);
    if (error) {
        createAlert('error', error.message);
        return profileUrl
    } else {
        //remove old image from storage
        if (profileUrl && profileUrl !== "Default_pfp.jpg") {
            const { error } = await supabase.storage
                .from("profile-images")
                .remove([profileUrl]);

            if (error) {
                createAlert('error', "Failed to delete old image: " + error.message);
                return profileUrl
            }
        }
        await supabase
            .from("Users")
            .update({ image_file: fileName })
            .eq("user_id", userId)
            .then((res) => { if (res.error) createAlert('error', res.error.message) });
        return fileName
    }
};