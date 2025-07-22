import type { ChangeEvent } from "react";
import type { AlertType } from "../../../common/contexts/AlertContext";
import supabase from "../../../helper/supabaseClient";

// Fetches the profile image name of user
export const fetchProfileImage = async (userId: string) => {
    const { data, error } = await supabase
        .from("Users")
        .select("image_file")
        .eq("user_id", userId)
        .single();
    if (error) {
        console.log(error.message)
        return null
    }
    return data.image_file
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
export const updateProfileImage = async (file: File, userId: string, oldProfileName: string) => {

    const fileExt = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    const { error } = await supabase.storage
        .from("profile-images")
        .upload(fileName, file);

    if (error) {
        console.log(error.message);
        return oldProfileName
    }

    //remove old image from storage
    if (oldProfileName && oldProfileName !== "Default_pfp.jpg") {
        const { error } = await supabase.storage
            .from("profile-images")
            .remove([oldProfileName]);

        if (error) {
            console.log(error.message);
            return oldProfileName
        }
    }

    await supabase
        .from("Users")
        .update({ image_file: fileName })
        .eq("user_id", userId)
        .then((res) => { if (res.error) console.log(res.error.message) });

    return fileName
};