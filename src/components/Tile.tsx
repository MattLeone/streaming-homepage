import { useState } from "react";
import type { TileItem } from "../types";

interface TileProps {
  item: TileItem;
  focused: boolean;
  onImageError: () => void;
}

const Tile: React.FC<TileProps> = ({ item, focused, onImageError }) => {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <div className={`tile ${focused ? 'focused' : ''}`}>
      {!imageLoaded && (
        <div className="tile-placeholder">
          📺
        </div>
      )}
      <img 
        src={item.image}
        alt={item.text}
        onLoad={() => setImageLoaded(true)}
        onError={onImageError}
        style={{ display: imageLoaded ? 'block' : 'none' }}
      />
    </div>
  )
}

export default Tile;