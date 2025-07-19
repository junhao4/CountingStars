import { useNavigate } from "react-router-dom";
import type { ItemWithCategories } from "../../../../../helper/types";

import EditIcon from '@mui/icons-material/Edit';
import CategoryChips from "./CategoryChips";


export default function ItemRow({item}: {item: ItemWithCategories}) {
    const navigate = useNavigate()

    return (
        <tr draggable onDragStart={(e) => e.dataTransfer.setData("id", 'item,' + item.id)}
            onDoubleClick={() => navigate('../item/' + item.id, { relative: 'path' })}>
            <td><EditIcon />&ensp;{item.name}</td>
            <td>{item.quantity}</td>
            <td><CategoryChips params={item.categories} /></td>
            <td>{item.lastModified}</td>
            <td></td>
        </tr>)
}