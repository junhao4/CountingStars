import { describe, expect, it } from "vitest";
import { validateAddFolderName, validateMoveIntoFolder } from "../functions/Folder";

describe("validateMoveIntoFolder fn", () => {
    it("should return false if source and destination folder are the same", () => {
        const moveItem = "folder,1"
        const folderId = 1

        expect(validateMoveIntoFolder(moveItem, folderId).data).toBe(false)
    })

    it("should return true if moving item into root folder", () => {
        const moveItem = "item,1"
        const folderId = null

        expect(validateMoveIntoFolder(moveItem, folderId).data).toBe(true)
    })
})

describe("validateAddFolderName fn", () => {
    it("should return false if name is empty", () => {
        expect(validateAddFolderName("")).toEqual({ data: false, error: "Empty Folder Name" })
    })

    it("should return true if name is valid", () => {
        expect(validateAddFolderName("Folder...")).toEqual({ data: true, error: null })
    })
})

