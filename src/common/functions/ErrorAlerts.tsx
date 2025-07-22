import type { CreateAlertType } from "../contexts/AlertContext"

type ErrorAlerts =
    | true
    | "userError"
    | "itemError"
    | "categoryError"
    | "itemCategoryError"
    | "logError"
    | "notificationError"

    | "emptyName"
    | "duplicateName"

export const handleGenerateAlert = (error: ErrorAlerts, createAlert: CreateAlertType) => {
    switch (error) {
        case "userError":
        case "itemError":
        case "itemCategoryError":
        case "categoryError":
        case "logError":
        case "notificationError":
            createAlert("error", "Supabase " + error)
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