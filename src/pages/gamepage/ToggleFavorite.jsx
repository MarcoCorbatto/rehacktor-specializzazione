import { useContext } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import favoriteContext from "../../context/FavoritesContext"

export default function ToggleFavorite({ data }) {
  const {favorite, addFavorites, removeFavorite} = useContext(favoriteContext);
  const isFavorite = () => addFavorites.find((el) => +el.game_id === data?.id);
  return (
    <div>
      {isFavorite() ? (
        <button onClick={() => removeFavorite(data)}>
          <FaHeart />
        </button>
      ) : (
        <button onClick={() => addFavorites(data)}>
          <FaRegHeart />
        </button>
      )}
    </div>
  );
}
