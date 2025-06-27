import { useEffect, useState, useRef } from "react";
import type { ParsedSetData, TileItem } from "../types";
import { fetchSetRefItems } from "../utils";
import Tile from "./Tile";

interface Props {
    container: ParsedSetData;
    isActive: boolean;
    focusedIndex: number;
    onMaxIndexChange: (maxIndex: number) => void;
}

const ContentRow: React.FC<Props> = ({ container, isActive, focusedIndex, onMaxIndexChange }) => {
    const [items, setItems] = useState<TileItem[]>(container.items || [])
    const [loading, setLoading] = useState(container.type === 'SetRef')
    const tileRefs = useRef<(HTMLDivElement | null)[]>([])
    
    const removeItem = (index: number) => {
        setItems(prev => prev.filter((_, i) => i !== index))
    }
    
    useEffect(() => {
        onMaxIndexChange(Math.max(0, items.length - 1))
    }, [items.length, onMaxIndexChange])
    
    useEffect(() => {
        const tile = tileRefs.current[focusedIndex]
        if (isActive && tile && focusedIndex < items.length) {
            tile.scrollIntoView({ 
                behavior: 'smooth', 
                inline: 'center',
                block: 'nearest'
            })
        }
    }, [isActive, focusedIndex, items.length])
    
    useEffect(() => {
        if (container.type === 'SetRef' && container.refId) {
            fetchSetRefItems(container.refId).then(setItems).finally(() => setLoading(false))
        }
    }, [container])
    
    if (loading) return (
        <div className="content-row">
            <h2>{container.title}</h2>
            <div className="loading">Loading magical content...</div>
        </div>
    )
    
    return (
        <div className="content-row">
            <h2>{container.title}</h2>
            <div className="tiles">
                {items.map((item, index) => (
                    <div key={`${item.text}-${index}`} ref={el => { tileRefs.current[index] = el }}>
                        <Tile 
                            item={item}
                            focused={isActive && index === focusedIndex}
                            onImageError={() => removeItem(index)}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ContentRow;