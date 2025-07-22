import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import useFilterModel from "../hooks/useFilterModel";
import type { InventoryRow } from "../hooks/useGetFolderContent";


describe("filter hook", () => {
    const cat1 = {id: 1, name: "A"}
    const cat2 = {id: 2, name: "B"}
    const cat3 = {id: 3, name: "C"}

    const item1 = {
        id: 1,
        name: "A",
        quantity: 1,
        categories: [cat1],
        description: "A",
        lastModified: "2022",
        expiryDate: null,
        type: 'item' as const
    }
    const item23 = {
        id: 2,
        name: "B",
        quantity: 2,
        categories: [cat2, cat3],
        description: "B",
        lastModified: "2023",
        expiryDate: null,
        type: 'item' as const
    }
    const item2 = {
        id: 3,
        name: "C",
        quantity: 3,
        categories: [cat2],
        description: "C",
        lastModified: "2024",
        expiryDate: null,
        type: 'item' as const
    }

    const unfilteredData: InventoryRow[] = [item23, item2, item1]

    it("should filter", () => {
        const { result } = renderHook(() => useFilterModel(unfilteredData))

        // Filter category id 1
        act(() => {
            result.current.handleFilterCategory(1)
        })

        expect(result.current.selectedCategories).toEqual([1])
        expect(result.current.filteredData).toEqual([item1])

        // Then, Filter category id 2
        act(() => {
            result.current.handleFilterCategory(2)
        })

        expect(result.current.selectedCategories).toEqual([1,2])
        expect(result.current.filteredData).toEqual([])

        // Then, unfilter category id 1
        act(() => {
            result.current.handleFilterCategory(1)
        })

        expect(result.current.selectedCategories).toEqual([2])
        expect(result.current.filteredData).toEqual([item23, item2])

       // Then, filter category id 1 and 3
        act(() => {
            result.current.handleFilterCategory(1)
        })

        act(() => {
            result.current.handleFilterCategory(3)
        })

        expect(result.current.selectedCategories).toEqual([2,1,3])
        expect(result.current.filteredData).toEqual([])
    })
})