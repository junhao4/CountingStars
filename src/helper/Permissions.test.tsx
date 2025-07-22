import { describe, expect, it } from "vitest";
import { hasPermission } from "./RolePermissions";
import { dummyUUID } from "../tests/testApi";

describe("User permissions", () => {

    describe("Owner permissions for removing", () => {

        it(`should return true when owner is trying to remove himself, 
        and organization has other owners`, () => {
            const dummyUser = { userId: dummyUUID, organizationId: 69, role: 'owner' as const }

            expect(hasPermission(dummyUser, 'users', 'remove', { ...dummyUser, countOfOwners: 69 })).toBe(true)
        })

        it(`should return false when owner is trying to remove himself, 
        but organization only has one owner`, () => {
            const dummyUser = { userId: dummyUUID, organizationId: 69, role: 'owner' as const }

            expect(hasPermission(dummyUser, 'users', 'remove', { ...dummyUser, countOfOwners: 1 })).toBe(false)
        })
    })

    describe("Owner permissions for changing to admin / member", () => {

        it(`should return true when owner wants to promote / demote someone else to admin`, () => {
            const dummyUser = { userId: dummyUUID, organizationId: 69, role: 'owner' as const }
            const targetUser = { userId: "DWADSADAD", organizationId: 69, role: 'member' as const }

            expect(hasPermission(dummyUser, 'users', 'changeToAdmin', { ...targetUser, countOfOwners: 1 })).toBe(true)
            expect(hasPermission(dummyUser, 'users', 'changeToMember', { ...targetUser, countOfOwners: 1 })).toBe(true)
        })

        it(`should return false when owner is trying to demote himself,
        but organization only has one owner`, () => {
            const dummyUser = { userId: dummyUUID, organizationId: 69, role: 'owner' as const }

            expect(hasPermission(dummyUser, 'users', 'changeToAdmin', { ...dummyUser, countOfOwners: 1 })).toBe(false)
            expect(hasPermission(dummyUser, 'users', 'changeToMember', { ...dummyUser, countOfOwners: 1 })).toBe(false)
        })

    })

    describe("Admin permissions for promoting to owner", () => {
        it("should return false when trying to promote anyone to owner", () => {
            const dummyUser = { userId: dummyUUID, organizationId: 69, role: 'admin' as const }
            const targetUser = { userId: "DWADSADAD", organizationId: 69, role: 'member' as const }


            expect(hasPermission(dummyUser, 'users', 'changeToOwner', { ...dummyUser, countOfOwners: 69 })).toBe(false)
            expect(hasPermission(dummyUser, 'users', 'changeToOwner', { ...targetUser, countOfOwners: 69 })).toBe(false)
        })
    })

    describe("Admin permissions for changing role to admin / member", () => {

        it("should return false when trying to demote owner", () => {
            const dummyUser = { userId: dummyUUID, organizationId: 69, role: 'admin' as const }
            const targetUser = { userId: "DWADSADAD", organizationId: 69, role: 'owner' as const }


            expect(hasPermission(dummyUser, 'users', 'changeToAdmin', { ...targetUser, countOfOwners: 69 })).toBe(false)
            expect(hasPermission(dummyUser, 'users', 'changeToAdmin', { ...targetUser, countOfOwners: 1 })).toBe(false)
            expect(hasPermission(dummyUser, 'users', 'changeToMember', { ...targetUser, countOfOwners: 69 })).toBe(false)
            expect(hasPermission(dummyUser, 'users', 'changeToMember', { ...targetUser, countOfOwners: 1 })).toBe(false)
        })

        it("should return true for all other roles", () => {
            const dummyUser = { userId: dummyUUID, organizationId: 69, role: 'admin' as const }

            const targetAdminUser = { userId: "DWADSADAD", organizationId: 69, role: 'admin' as const }
            const targetMemberUser = { userId: "DWADSADAD", organizationId: 69, role: 'member' as const }

            expect(hasPermission(dummyUser, 'users', 'changeToAdmin', { ...targetAdminUser, countOfOwners: 1 })).toBe(true)
            expect(hasPermission(dummyUser, 'users', 'changeToAdmin', { ...targetMemberUser, countOfOwners: 1 })).toBe(true)
            expect(hasPermission(dummyUser, 'users', 'changeToMember', { ...targetAdminUser, countOfOwners: 1 })).toBe(true)
            expect(hasPermission(dummyUser, 'users', 'changeToMember', { ...targetMemberUser, countOfOwners: 1 })).toBe(true)
        })

    })

    describe("Member permissions", () => {
        it("should return false for all attributes", () => {
            const dummyUser = { userId: dummyUUID, organizationId: 69, role: 'member' as const }

            const targetOwnerUser = { userId: "DWADSADAD", organizationId: 69, role: 'owner' as const }
            const targetAdminUser = { userId: "DWADSADAD", organizationId: 69, role: 'admin' as const }
            const targetMemberUser = { userId: "DWADSADAD", organizationId: 69, role: 'member' as const }

            expect(hasPermission(dummyUser, 'users', 'changeToOwner', { ...dummyUser, countOfOwners: 69 })).toBe(false)
            expect(hasPermission(dummyUser, 'users', 'changeToAdmin', { ...dummyUser, countOfOwners: 69 })).toBe(false)
            expect(hasPermission(dummyUser, 'users', 'remove', { ...dummyUser, countOfOwners: 69 })).toBe(false)

            expect(hasPermission(dummyUser, 'users', 'changeToOwner', { ...targetOwnerUser, countOfOwners: 69 })).toBe(false)
            expect(hasPermission(dummyUser, 'users', 'changeToAdmin', { ...targetOwnerUser, countOfOwners: 69 })).toBe(false)
            expect(hasPermission(dummyUser, 'users', 'remove', { ...targetOwnerUser, countOfOwners: 69 })).toBe(false)

            expect(hasPermission(dummyUser, 'users', 'changeToOwner', { ...targetAdminUser, countOfOwners: 69 })).toBe(false)
            expect(hasPermission(dummyUser, 'users', 'changeToAdmin', { ...targetAdminUser, countOfOwners: 69 })).toBe(false)
            expect(hasPermission(dummyUser, 'users', 'remove', { ...targetAdminUser, countOfOwners: 69 })).toBe(false)

            expect(hasPermission(dummyUser, 'users', 'changeToOwner', { ...targetMemberUser, countOfOwners: 69 })).toBe(false)
            expect(hasPermission(dummyUser, 'users', 'changeToAdmin', { ...targetMemberUser, countOfOwners: 69 })).toBe(false)
            expect(hasPermission(dummyUser, 'users', 'remove', { ...targetMemberUser, countOfOwners: 69 })).toBe(false)

        })
    })

})

describe("Category permissions", () => {
    it("Owners and Admins should have permission", () => {
        const dummyOwnerUser = { userId: dummyUUID, organizationId: 69, role: 'owner' as const }
        const dummyAdminUser = { userId: dummyUUID, organizationId: 69, role: 'admin' as const }

        expect(hasPermission(dummyOwnerUser, 'categories', 'editName', { id: 1, name: "A" })).toBe(true)
        expect(hasPermission(dummyAdminUser, 'categories', 'editName', { id: 1, name: "A" })).toBe(true)

        expect(hasPermission(dummyOwnerUser, 'categories', 'delete', { id: 1, name: "A" })).toBe(true)
        expect(hasPermission(dummyAdminUser, 'categories', 'delete', { id: 1, name: "A" })).toBe(true)
    })

    it("Members should not be able to edit or delete categories", () => {
        const dummyMemberUser = { userId: dummyUUID, organizationId: 69, role: 'member' as const }
        
        expect(hasPermission(dummyMemberUser, 'categories', 'editName', { id: 1, name: "A" })).toBe(false)
        expect(hasPermission(dummyMemberUser, 'categories', 'editName', { id: 1, name: "A" })).toBe(false)
    })
})