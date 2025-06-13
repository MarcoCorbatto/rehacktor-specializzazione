import LazyLoadGameImage from "./LazyLoadGameImage";
import supabase from "../supabase/supabase-client";

export default function CardGame({ game }) {
  const handleAddToFavorites = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error("Errore login:", userError.message);
      alert("Devi essere loggato per aggiungere ai preferiti.");
      return;
    }

    const userId = userData?.user?.id;

    const { error } = await supabase
      .from("favorites")
      .insert([{ user_id: userId, game_id: game.id }]);

    if (error) {
      console.error("Errore inserimento:", error.message);
      alert("Errore durante l'aggiunta.");
    } else {
      alert("Gioco aggiunto ai preferiti!");
    }
  };

  return (
    <div className="card bg-base-100 shadow-md w-full h-full">
      <figure className="h-48 overflow-hidden">
        <LazyLoadGameImage
          image={game.background_image}
          alt={game.name}
          className="w-full h-full object-cover"
        />
      </figure>
      <div className="card-body flex flex-col justify-between">
        <div>
          <h2 className="card-title text-base">{game.name}</h2>
          <p className="text-sm text-gray-600">Uscita: {game.released}</p>
        </div>
        <div className="card-actions mt-4 flex-wrap gap-2">
          {game.genres?.map((genre) => (
            <div key={genre.id} className="badge badge-outline">
              {genre.name}
            </div>
          ))}
        </div>
        <button
          className="btn btn-outline btn-sm mt-3"
          onClick={handleAddToFavorites}
        >
          ❤️ 
        </button>
      </div>
    </div>
  );
}
