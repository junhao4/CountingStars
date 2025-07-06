export type Organization = {
    id: number
    name: string
    imageFile: string | null
}

export const OrganizationRoles = ["owner", "admin", "member", "pending"] as const

export type OrganizationRolesType = typeof OrganizationRoles[number]

