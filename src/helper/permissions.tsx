import type { Inventory, Organization, User } from "./types";

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
} as const satisfies RolesWithPermissions

export function hasPermission<Resource extends keyof Permissions>(
    user: User,
    organization: Organization,
    resource: Resource,
    action: Permissions[Resource]["action"],
    data?: Permissions[Resource]["dataType"]
) {
    const role = organization.role
    const permission = (ROLES as RolesWithPermissions)[role][resource]?.[action]
    if (permission == null) return false

    if (typeof permission === "boolean") return permission
    return data != null && permission(user, data)
}

