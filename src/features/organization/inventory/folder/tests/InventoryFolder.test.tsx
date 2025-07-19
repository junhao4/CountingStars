import { describe, expect, it } from "vitest";
import { validateAddFolderName, validateMoveIntoFolder } from "../functions/Folder";
import { sortByLastModified, sortByName, sortByQuantity } from "../hooks/useSortingModel";
import type { InventoryRow } from "../components/InventoryFolder";

describe("validateMoveIntoFolder fn", () => {
    it("should return false if source and destination folder are the same", () => {
        const moveItem = "folder,1"
        const folderId = 1

        expect(validateMoveIntoFolder(moveItem, folderId)).toBe(false)
    })

    it("should return true if moving item into root folder", () => {
        const moveItem = "item,1"
        const folderId = null

        expect(validateMoveIntoFolder(moveItem, folderId)).toBe(true)
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

describe("sorting fns", () => {
    it("should return sorted data by name with folders on top", () => {
        const ascending = true // A to Z
        const foldersOnTop = true

        const dummyItem = {
            id: 1, name: "", type: 'item' as 'item',
            quantity: 0, categories: [], lastModified: "", description: "", expiryDate: null, parentId: 0, createdAt: ""
        }

        const initial: InventoryRow[] = [
            { ...dummyItem, id: 4, name: "D", type: 'item' },
            { ...dummyItem, id: 3, name: "C", type: 'item' },
            { ...dummyItem, id: 1, name: "A", type: 'item' },
            { ...dummyItem, id: 2, name: "B", type: 'folder' },
            { ...dummyItem, id: 5, name: "E", type: 'item' },
        ]

        const result: InventoryRow[] = [
            { ...dummyItem, id: 2, name: "B", type: 'folder' },
            { ...dummyItem, id: 1, name: "A", type: 'item' },
            { ...dummyItem, id: 3, name: "C", type: 'item' },
            { ...dummyItem, id: 4, name: "D", type: 'item' },
            { ...dummyItem, id: 5, name: "E", type: 'item' },
        ]

        expect(initial.sort(sortByName(ascending, foldersOnTop))).toStrictEqual(result)
    })

    it("should return sorted data by quantity with folders on top", () => {
        const ascending = true // largest to smallest
        const foldersOnTop = true

        const dummyItem = {
            id: 1, name: "", type: 'item' as 'item',
            quantity: 0, categories: [], lastModified: "", description: "", expiryDate: null, parentId: 0, createdAt: ""
        }

        const initial: InventoryRow[] = [
            { ...dummyItem, id: 4, quantity: 4, type: 'item' },
            { ...dummyItem, id: 3, quantity: 3, type: 'item' },
            { ...dummyItem, id: 1, quantity: 1, type: 'item' },
            { ...dummyItem, id: 5, type: 'folder' },
            { ...dummyItem, id: 2, quantity: 2, type: 'item' },
        ]

        const result: InventoryRow[] = [
            { ...dummyItem, id: 5, type: 'folder' },
            { ...dummyItem, id: 4, quantity: 4, type: 'item' },
            { ...dummyItem, id: 3, quantity: 3, type: 'item' },
            { ...dummyItem, id: 2, quantity: 2, type: 'item' },
            { ...dummyItem, id: 1, quantity: 1, type: 'item' },   
        ]

        expect(initial.sort(sortByQuantity(ascending, foldersOnTop))).toStrictEqual(result)
    })

    it("should return sorted data by last modified date", () => {
        const ascending = true // newest to oldest
        const foldersOnTop = false

        const dummyItem = {
            id: 1, name: "", type: 'item' as 'item',
            quantity: 0, categories: [], lastModified: "", description: "", expiryDate: null, parentId: 0, createdAt: ""
        }

        const initial: InventoryRow[] = [
            { ...dummyItem, id: 4, type: 'item', lastModified: "2020-04" },
            { ...dummyItem, id: 5, type: 'item', lastModified: "2020-05" },
            { ...dummyItem, id: 1, type: 'item', lastModified: "2020-01" },
            { ...dummyItem, id: 3, type: 'folder', lastModified: "2020-03"},
            { ...dummyItem, id: 2, type: 'item', lastModified: "2020-02" },
        ]

        const result: InventoryRow[] = [
            { ...dummyItem, id: 5, type: 'item', lastModified: "2020-05"},
            { ...dummyItem, id: 4, type: 'item', lastModified: "2020-04" },
            { ...dummyItem, id: 3, type: 'folder', lastModified: "2020-03" },
            { ...dummyItem, id: 2, type: 'item', lastModified: "2020-02" },
            { ...dummyItem, id: 1, type: 'item', lastModified: "2020-01" },
        ]

        expect(initial.sort(sortByLastModified(ascending, foldersOnTop))).toStrictEqual(result)
    })
})