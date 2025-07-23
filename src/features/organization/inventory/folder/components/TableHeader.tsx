import { Tooltip, Popover, MenuList, MenuItem } from "@mui/material";
import { useRef, useState } from "react";
import type { InventorySort } from "../hooks/useSortingModel";
import SwapVertIcon from "@mui/icons-material/SwapVert"
import CheckIcon from '@mui/icons-material/Check';
import useGetCategoryList from "../../../item/hooks/useGetCategoryList";

interface TableHeaderProps {
    foldersOnTop: boolean,
    selectedCategories: number[],
    handleFilterCategory: (category: number) => void,
    handleSort: (arg0: InventorySort) => void
    getSortTitle: (column: "name" | "quantity" | "category" | "lastModified") => string
    getSortIcon: (column: 'name' | 'quantity' | 'category' | 'lastModified') => React.ReactElement
}

export default function TableHeader({ foldersOnTop, selectedCategories, handleFilterCategory,
    getSortTitle, getSortIcon, handleSort }: TableHeaderProps) {

    const { categoryList } = useGetCategoryList()

    const [categoryMenuOpen, setCategoryMenuOpen] = useState(false)
    const categoryRef = useRef(null)

    const sortRef = useRef(null)
    const [sortMenuOpen, setSortMenuOpen] = useState(false)

    return (
        <thead>
            <tr>
                <td width={"5%"}>
                    <p>ID</p>
                </td>
                <Tooltip title={getSortTitle('name')} onClick={() => handleSort('name')}>
                    <td width={'30%'}>
                        <p>Name&ensp;{getSortIcon('name')}
                        </p>
                    </td>
                </Tooltip>

                <Tooltip title={getSortTitle('quantity')} onClick={() => handleSort('quantity')}>
                    <td width={'10%'}>
                        <p>Quantity&ensp;{getSortIcon('quantity')}</p>
                    </td>
                </Tooltip>

                <Tooltip title={"Filter by category"} ref={categoryRef} onClick={() => setCategoryMenuOpen(true)}>
                    <td width={'25%'}>
                        Categories
                    </td>
                </Tooltip>
                <Popover open={categoryMenuOpen} anchorEl={categoryRef.current} onClose={() => setCategoryMenuOpen(prev => !prev)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
                    <MenuList disablePadding>
                        {categoryList.map((cat, index) =>
                            <MenuItem key={index} selected={selectedCategories.includes(cat.id)}
                                onClick={() => handleFilterCategory(cat.id)}>{cat.name}</MenuItem>)}
                    </MenuList>
                </Popover>

                <Tooltip title={getSortTitle('lastModified')} onClick={() => handleSort('lastModified')}>
                    <td width={'20%'}>
                        <p>Last Modified&ensp;{getSortIcon('lastModified')}</p>
                    </td>
                </Tooltip>

                <Tooltip title={"Set folders on top"} onClick={() => setSortMenuOpen(prev => !prev)} ref={sortRef}>
                    <td width={'10%'}><p>Sort&ensp;
                        <SwapVertIcon /></p>
                    </td>
                </Tooltip>
                
                <Popover open={sortMenuOpen} anchorEl={sortRef.current} onClose={() => setSortMenuOpen(false)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
                    <MenuList disablePadding>
                        <MenuItem onClick={() => handleSort('foldersOnTop')}>Sort folders on top&ensp;
                            {foldersOnTop && <CheckIcon />}
                        </MenuItem>
                        <MenuItem onClick={() => handleSort('foldersMix')}>Mix folders with items&ensp;
                            {!foldersOnTop && <CheckIcon />}
                        </MenuItem>
                    </MenuList>
                </Popover>

            </tr>
        </thead>
    )
}