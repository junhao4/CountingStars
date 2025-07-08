export type User = {
    id: string, // UUID
    name: string,
    email: string,
    imageFile: string,
    createdAt: string
}

export type FirstTimeUser = {
    id: string, // UUID
    name: null,
    email: string,
    imageFile: string,
    createdAt: string
}

export type Organization = {
    id: number
    name: string
    imageFile: string
    role: OrganizationRolesType
}

export const OrganizationRoles = ["owner", "admin", "member", "pending"] as const

export type OrganizationRolesType = typeof OrganizationRoles[number]

export type Inventory = {
    id: number,
    name: string,
    quantity: number,
    description: string,
    expiryDate: string
}

export type Notification = {
    id: number;
    notifier: string | null;
    organizationId: number
    status: boolean;
    type: number;
    createdAt: string;
}