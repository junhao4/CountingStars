import { useNavigate } from "react-router-dom";
import type { ItemWithCategories } from "../../../../../helper/types";

import EditIcon from '@mui/icons-material/Edit';
import CategoryChips from "./CategoryChips";
import { useState } from "react";


export default function ItemRow({item}: {item: ItemWithCategories}) {
    const navigate = useNavigate()

    const [over, setOver] = useState(false)
    
    return (
        <tr draggable className={`${over && "over"}`}
            onDragEnter={(e) => setOver(true)} onDragLeave={(e) => setOver(false)}
            onDragStart={(e) => e.dataTransfer.setData("id", 'item,' + item.id)}
            // onDragOver={e => e.preventDefault()}
            onDoubleClick={() => navigate('../item/' + item.id, { relative: 'path' })}>
            <td><EditIcon />&ensp;{item.name}</td>
            <td>{item.quantity}</td>
            <td><CategoryChips params={item.categories} /></td>
            <td>{item.lastModified}</td>
            <td></td>
        </tr>)
}