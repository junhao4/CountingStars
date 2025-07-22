import type { CreateAlertType } from "../contexts/AlertContext"

type ErrorAlerts =
    | true
    | "userError"
    | "itemError"
    | "categoryError"
    | "itemCategoryError"
    | "logError"

    | "emptyName"
    | "duplicateName"

export const handleGenerateAlert = (error: ErrorAlerts, createAlert: CreateAlertType) => {
    switch (error) {
        case "userError":
            createAlert("error", "Supabase user error")
            return
        case "categoryError":
            createAlert("error", "Supabase category erorr")
            return
        case "logError":
            createAlert("error", "Supabase log error")
            return

        case "emptyName":
            createAlert("warning", "Name cannot be empty!")
            return

        case "duplicateName":
            createAlert("warning", "Name already exists!")
            return

        default:
            return
    }
}