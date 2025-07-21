import { describe, expect, it } from "vitest"
import useSortingModel, { sortByName, sortByQuantity, sortByLastModified } from "../hooks/useSortingModel"
import type { InventoryRow } from "../hooks/useGetFolderContent"
import { act, renderHook } from "@testing-library/react"


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
            { ...dummyItem, id: 3, type: 'folder', lastModified: "2020-03" },
            { ...dummyItem, id: 2, type: 'item', lastModified: "2020-02" },
        ]

        const result: InventoryRow[] = [
            { ...dummyItem, id: 5, type: 'item', lastModified: "2020-05" },
            { ...dummyItem, id: 4, type: 'item', lastModified: "2020-04" },
            { ...dummyItem, id: 3, type: 'folder', lastModified: "2020-03" },
            { ...dummyItem, id: 2, type: 'item', lastModified: "2020-02" },
            { ...dummyItem, id: 1, type: 'item', lastModified: "2020-01" },
        ]

        expect(initial.sort(sortByLastModified(ascending, foldersOnTop))).toStrictEqual(result)
    })
})

describe("sorting hook", () => {
    const item1 = {
        id: 1,
        name: "A",
        quantity: 1,
        categories: [],
        description: "A",
        lastModified: "2022",
        expiryDate: null,
        type: 'item' as const
    }
    const item2 = {
        id: 2,
        name: "B",
        quantity: 2,
        categories: [],
        description: "B",
        lastModified: "2023",
        expiryDate: null,
        type: 'item' as const
    }
    const item3 = {
        id: 3,
        name: "C",
        quantity: 3,
        categories: [],
        description: "C",
        lastModified: "2024",
        expiryDate: null,
        type: 'item' as const
    }
    const folder4 = {
        id: 4,
        parentId: null,
        name: "D",
        description: "D",
        lastModified: "2025",
        createdAt: "",
        type: 'folder' as const
    }

    const item5 = {
        id: 5,
        name: "E",
        quantity: 5,
        categories: [],
        description: "E",
        lastModified: "2026",
        expiryDate: null,
        type: 'item' as const
    }

    const folder6 = {
        id: 6,
        parentId: null,
        name: "F",
        description: "F",
        lastModified: "2027",
        createdAt: "",
        type: 'folder' as const
    }

    const unsortedData: InventoryRow[] = [item3, folder6, item2, folder4, item5, item1]

    it("should sort by name correctly", () => {

        const { result } = renderHook(() => useSortingModel(unsortedData))

        // Default sorted by name and folders on top true
        expect(result.current.ascending).toBe(true)
        expect(result.current.foldersOnTop).toBe(true)
        expect(result.current.getSortTitle('name')).toBe("Sort Z to A") // Tooltip displays opposite
        expect(result.current.sortedData).toEqual([folder4, folder6, item1, item2, item3, item5])

        // Sort in reverse order by name
        act(() => {
            result.current.handleSort('name')
        })

        expect(result.current.ascending).toBe(false)
        expect(result.current.foldersOnTop).toBe(true)
        expect(result.current.getSortTitle('name')).toBe("Sort A to Z") // Tooltip displays opposite
        expect(result.current.sortedData).toEqual([folder6, folder4, item5, item3, item2, item1])

    })

    it("should sort by quantity correctly", () => {
        const { result } = renderHook(() => useSortingModel(unsortedData))

        // Sort in ascending order by quantity
        act(() => {
            result.current.handleSort('quantity')
        })

        expect(result.current.ascending).toBe(true)
        expect(result.current.foldersOnTop).toBe(true)
        expect(result.current.getSortTitle('quantity')).toBe("Sort lowest first")
        expect(result.current.sortedData).toEqual([folder6, folder4, item5, item3, item2, item1])

        // Sort in descending order
        act(() => {
            result.current.handleSort('quantity')
        })

        expect(result.current.ascending).toBe(false)
        expect(result.current.foldersOnTop).toBe(true)
        expect(result.current.getSortTitle('quantity')).toBe("Sort highest first")
        expect(result.current.sortedData).toEqual([folder4, folder6, item1, item2, item3, item5])
    })

    it("should sort by last modifited date correctly", () => {
        const { result } = renderHook(() => useSortingModel(unsortedData))

        // Sort in ascending order by last modified date
        act(() => {
            result.current.handleSort('lastModified')
        })

        expect(result.current.ascending).toBe(true)
        expect(result.current.foldersOnTop).toBe(true)
        expect(result.current.getSortTitle('lastModified')).toBe("Sort oldest first")
        expect(result.current.sortedData).toEqual([folder6, folder4, item5, item3, item2, item1])

        // Sort in descending order
        act(() => {
            result.current.handleSort('lastModified')
        })

        expect(result.current.ascending).toBe(false)
        expect(result.current.foldersOnTop).toBe(true)
        expect(result.current.getSortTitle('lastModified')).toBe("Sort newest first")
        expect(result.current.sortedData).toEqual([folder4, folder6, item1, item2, item3, item5])
    })

    it("should sort correctly when changing folder preference", () => {
        const { result } = renderHook(() => useSortingModel(unsortedData))

        // Set folders to be mixed, should keep original sorting type
        act(() => {
            result.current.handleSort('name')
        })

        act(() => {
            result.current.handleSort('foldersMix')
        })

        expect(result.current.ascending).toBe(false)
        expect(result.current.foldersOnTop).toBe(false)
        expect(result.current.getSortTitle('name')).toBe("Sort A to Z") // Tooltip displays opposite
        expect(result.current.sortedData).toEqual([folder6, item5, folder4, item3, item2, item1])

        // Set folders to appear on top
        act(() => {
            result.current.handleSort('foldersOnTop')
        })

        expect(result.current.ascending).toBe(false)
        expect(result.current.foldersOnTop).toBe(true)
        expect(result.current.getSortTitle('name')).toBe("Sort A to Z") // Tooltip displays opposite
        expect(result.current.sortedData).toEqual([folder6, folder4, item5, item3, item2, item1])
    })

})