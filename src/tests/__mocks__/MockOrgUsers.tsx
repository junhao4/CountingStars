import { vi } from "vitest"

// Do not import this file, instead, copy the mocks you need directly into the testing file

vi.mock("../../features/organization/users/api/UserGridApi", () => ({
    fetchOrganizationUsers: vi.fn().mockResolvedValue([{
        id: "Test UUID",
        name: "Test User",
        role: "owner" as const,
        imageFile: "",
        email: "Test Email",
    }]),
    addOrganizationUser: vi.fn().mockResolvedValue(true),
    updateUserRole: vi.fn().mockResolvedValue(true),
    deleteUser: vi.fn().mockResolvedValue(undefined),
    acceptPendingUser: vi.fn().mockResolvedValue(undefined),
    rejectPendingUser: vi.fn().mockResolvedValue(undefined),
}))