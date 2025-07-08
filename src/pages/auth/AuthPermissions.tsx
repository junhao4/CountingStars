import type { Inventory, Organization, User } from "../../helper/types";

type Role = "owner" | "admin" | "member" | "pending"

type PermissionCheck<Key extends keyof Permissions> = 
    | boolean
    | ((user: User, data: Permissions[Key]["dataType"]) => boolean)

type RolesWithPermissions = {
    [R in Role]: Partial<{
        [Key in keyof Permissions]: Partial<{
            [Action in Permissions[Key]["action"]]: PermissionCheck<Key>
        }>
    }>
}

type Permissions = {
    organization: {
        dataType: Organization
        action: "view" | "update" | "delete"
    },
    inventory: {
        dataType: Inventory
        action: "view" | "update" | "delete"
    }
}

const ROLES = {
    owner: {
        organization: {
            view: true,
            update: true,
            delete: true
        }
    },
    admin: {
        organization: {
            view: true,
            update: true,
            delete: true
        }
    },
    member: {
        organization: {
            view: true,
            update: true,
            delete: true
        }
    },
    pending: {
        organization: {
            view: true,
            update: true,
            delete: true
        }
    },
} as RolesWithPermissions