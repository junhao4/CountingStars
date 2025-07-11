import type { CreateAlertType } from "../../../../common/contexts/AlertContext"
import supabase from "../../../../helper/supabaseClient"
import type { OrganizationRolesType } from "../../../../helper/types";
import { addNotification } from "../../../notifications/api/NotificationsApi"

export const fetchOrganizationUsers = async (organizationId: number) => {
    const { data, error } = await supabase
        .from("users_organizations")
        .select("userId:user_id, role")
        .eq("organization_id", organizationId)

    if (error) {
        console.log(error.message);
        return null;
    }
    const promises = data.map(async (user) => {
        const { data, error } = await supabase
            .from("Users")
            .select("userId:user_id, name, image_file, email, createdAt:created_at")
            .eq("user_id", user.userId)
            .single();

        if (error) {
            console.log(error.message);
            return null;
        }

        var imageURL = "";
        if (data.image_file) {
            const { data: img, error: e } = await supabase.storage
                .from("profile-images")
                .download(data.image_file);

            if (e) {
                console.log(e.message);
            } else {
                imageURL = URL.createObjectURL(img);
            }
        }
        const result = {
            id: user.userId,
            name: data.name || "",
            role: user.role as OrganizationRolesType,
            imageFile: imageURL,
            email: data.email,
            createdAt: data.createdAt 
        }
        return result;
    });

    return (await Promise.all(promises)).filter(data => !!data)
};

export const addOrganizationUser = async (currentUserId: string, organizationId: number, email: string, role: string, createAlert: CreateAlertType) => {
    const { data, error } = await supabase.from('Users')
        .select('userId:user_id')
        .eq('email', email)
        .maybeSingle()

    if (error) {
        console.log(error.message)
        return null
    } else if (!data) {
        createAlert("warning", "Invalid email - No user associated with email")
        return null
    }

    const { error: error2 } = await supabase.from('users_organizations')
        .insert({ user_id: data.userId, organization_id: organizationId, role })

    if (error2) {
        console.log(error2)
        return null
    }
    // Notify user of addition to org
    await addNotification(currentUserId, data.userId, organizationId, 1)
    return true
}

// Commits any changes to supabase + update table view
export const updateUserRole = async (userId: string, targetId: string, organizationId: number, role: OrganizationRolesType) => {
    const { error } = await supabase
        .from("users_organizations")
        .update({ role: role })
        .eq("user_id", targetId)
        .eq("organization_id", organizationId)
        .single()

    if (error) {
        console.log(error.message)
        return false
    }

    // Notify user of role change
    await addNotification(userId, targetId, organizationId, 4);
    return true
};

export const deleteUser = async (userId: string, targetId: string, organizationId: number) => {
    const { error } = await supabase
        .from("users_organizations")
        .delete()
        .eq("user_id", userId)
        .eq("organization_id", organizationId)

    if (error) {
        console.log(error.message)
        return false
    }
    else {
        //notify user of deletion
        addNotification(userId, targetId, organizationId, 2);
    }
};

export const acceptPendingUser = async (userId: string, targetId: string, organizationId: number) => {
    const { error } = await supabase
        .from("users_organizations")
        .update({ role: "member" })
        .eq("user_id", targetId)
        .eq("organization_id", organizationId)
    if (error) {
        console.log(error.message);
        return false
    }
    await addNotification(userId, targetId, organizationId, 5)
};

export const rejectPendingUser = async (userId: string, targetId: string, organizationId: number) => {
    const { error } = await supabase
        .from("users_organizations")
        .delete()
        .eq("user_id", targetId)
        .eq("organization_id", organizationId)
    if (error) {
        console.log(error.message)
        return false
    }
    await addNotification(userId, targetId, organizationId, 6)
};