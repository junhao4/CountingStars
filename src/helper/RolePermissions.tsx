import type { Category, Item, Log, Organization, OrganizationRolesType, UserOrganization } from "./types";

const roleToValue = (v: OrganizationRolesType) => {
    switch (v) {
        case "owner":
            return 2;
        case "admin":
            return 1;
        case "member":
        case "pending":
            return 0;

        default:
            return 0;
    }
};

export const compareRolesTo = (v1: OrganizationRolesType, v2: OrganizationRolesType) => {
    return roleToValue(v1) - roleToValue(v2);
};


type Role = OrganizationRolesType

// The permission for the feature is either a boolean value 
// or a function that takes in data with type defined within the keyof Permissions.
type PermissionCheck<Key extends keyof Permissions> =
    | boolean
    | ((user: UserOrganization, data: Permissions[Key]["dataType"]) => boolean)



// For each role, define the features, and their corresponding permission value or functions
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
    users: {
        dataType: UserOrganization & { countOfOwners: number }
        action: "view" | "edit" | "addUser" | "changeToOwner" | "changeToAdmin" | "changeToMember" | "remove"
    }
    inventory: {
        dataType: Item
        action: "view" | "update" | "delete"
    },
    categories: {
        dataType: Category
        action: "view" | "editName" | "delete"
    }
    log: {
        dataType: Log
        action: "view"
    }
}

const ROLES = {
    owner: {
        organization: {
            view: true, update: true, delete: true
        },
        users: {
            view: true, edit: true, addUser: true, changeToOwner: true, 
            changeToAdmin: (user, resource) => {
                // If user is owner, and trying to demote oneself to admin but only one owner present, return no permissions.
                return !(user.role === "owner" && user.userId === resource.userId && resource.countOfOwners === 1)
            }, 
            changeToMember: (user, resource) => {
                // If user is owner, and trying to demote himself to member but only one owner present, return no permissions.
                return !(user.role === "owner" && user.userId === resource.userId && resource.countOfOwners === 1)
            }, 
            remove: (user, resource) => {
                // If user is owner, and trying to remove oneself but only one owner present, return no permissions.
                return !(user.role === "owner" && user.userId === resource.userId && resource.countOfOwners === 1)
            }, 
        },
        inventory: {
            view: true, update: true, delete: true
        },
        categories: {
            view: true, editName: true ,delete: true
        },
        log: {
            view: true
        }
    },
    admin: {
        organization: {
            view: true, update: true, delete: false
        },
        users: {
            view: true, edit: (user, resource) => {
                return compareRolesTo(user.role, resource.role) >= 0
            }, 
            addUser: (user, resource) => {
                return compareRolesTo(user.role, resource.role) >= 0
            }, 
            changeToOwner: false, 
            // Only allowed if current role is greater than or equal to target's role
            changeToAdmin: (user, resource) => {
                return compareRolesTo(user.role, resource.role) >= 0
            }, 
            changeToMember: (user, resource) => {
                return compareRolesTo(user.role, resource.role) >= 0
            }, 
            remove: (user, resource) => {
                return compareRolesTo(user.role, resource.role) >= 0
            }, 
        },
        inventory: {
            view: true, update: true, delete: true
        },
        categories: {
            view: true, editName: true, delete: true
        },
        log: {
            view: true
        }
    },
    member: {
        organization: {
            view: true, update: false, delete: false
        },
        users: {
            view: true, edit: false, addUser: false, changeToOwner: false, changeToAdmin: false, changeToMember: false, 
            remove: (user, resource) => {
                return (user.userId == resource.userId)
            }
        },
        inventory: {
            view: true, update: false, delete: false
        },
        categories: {
            view: true, editName: false, delete: false
        },
        log: {
            view: true
        }
    },
    pending: {},
} as const satisfies RolesWithPermissions

export function hasPermission<Resource extends keyof Permissions>(
    user: UserOrganization,
    resource: Resource,
    action: Permissions[Resource]["action"],
    data?: Permissions[Resource]["dataType"]
) {
    const role = user.role
    const permission = (ROLES as RolesWithPermissions)[role][resource]?.[action]
    if (permission == null) return false

    if (typeof permission === "boolean") return permission
    return data != null && permission(user, data)
}

