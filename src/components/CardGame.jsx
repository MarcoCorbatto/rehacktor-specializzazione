import { Link } from 'react-router-dom';
import LazyLoadGameImage from "./LazyLoadGameImage";
import supabase from "../supabase/supabase-client";

export default function CardGame({ game }) {
  const handleAddToFavorites = async (event) => {
    event.stopPropagation(); // Previene che il click sul bottone apra la pagina del gioco
    event.preventDefault(); // Previene il comportamento predefinito del link

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error("Errore login:", userError.message);
      alert("Devi essere loggato per aggiungere ai preferiti.");
      return;
    }

    const userId = userData?.user?.id;

    const { data: existingFavorite, error: checkError } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", userId)
      .eq("game_id", game.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = nessun risultato trovato
      console.error("Errore durante la verifica dei preferiti:", checkError.message);
      alert("Errore durante la verifica dei preferiti.");
      return;
    }

    if (existingFavorite) {
      alert("Questo gioco è già nei tuoi preferiti!");
      return;
    }

    const { error: insertError } = await supabase
      .from("favorites")
      .insert([{ user_id: userId, game_id: game.id }]);

    if (insertError) {
      console.error("Errore inserimento:", insertError.message);
      alert("Errore durante l'aggiunta ai preferiti.");
    } else {
      alert("Gioco aggiunto ai preferiti!");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  const getBadgeClass = (index) => {
    const colors = ['badge-primary', 'badge-secondary', 'badge-accent', 'badge-info'];
    return colors[index % colors.length];
  };

  return (
    //  card-wrapper
    <Link to={`/games/${game.slug}/${game.id}`} className="flex flex-col h-full"> 
      <div className="card bg-base-100 shadow-xl w-full min-h-[400px] flex flex-col transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-2xl overflow-hidden"> {/* Aggiunto min-h-[400px] e overflow-hidden */}
        <figure className="h-48 overflow-hidden rounded-t-lg">
          <LazyLoadGameImage
            image={game.background_image}
            alt={game.name}
            className="w-full h-full object-cover"
          />
        </figure>

        <div className="card-body flex flex-col justify-between p-4 flex-grow"> {/* flex-grow spinge il bottone in basso */}
          <div> {/* Contenitore per titolo, data, rating */}
            <h2 className="card-title text-lg font-semibold mb-1 truncate">
              {game.name}
            </h2>

            <p className="text-sm text-gray-600">Uscita: {formatDate(game.released)}</p>
            {game.rating > 0 && (
              <p className="text-sm text-gray-600">Rating: {game.rating.toFixed(2)}</p>
            )}
          </div>

          {game.genres && game.genres.length > 0 && (
            <div className="card-actions mt-3 flex flex-wrap gap-2 justify-start">
              {game.genres.slice(0, 3).map((genre, index) => (
                <div key={genre.id} className={`badge badge-outline ${getBadgeClass(index)} text-xs px-2 py-1`}>
                  {genre.name}
                </div>
              ))}
              {game.genres.length > 3 && (
                <div className="badge badge-outline text-xs px-2 py-1">...</div>
              )}
            </div>
          )}

          {/* Il bottone è spinto in fondo da flex-grow sul card-body e justify-between */}
          <div className="mt-auto text-center pt-4"> {/* mt-auto per spingerlo in basso, pt-4 per un po' di spazio */}
            <button
              className="btn btn-outline btn-sm btn-circle btn-primary"
              onClick={handleAddToFavorites}
              title="Aggiungi ai preferiti"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="m11.645 20.917-7.393-7.393A8.067 8.067 0 0 1 2 6.669C2 2.766 5.253.5 9.006.5c2.613 0 4.298 1.488 5.753 3.394 1.455-1.906 3.14-3.394 5.753-3.394 3.753 0 7.006 2.266 7.006 6.169 0 2.26-.957 4.394-2.883 5.925L12.355 20.917a.997.997 0 0 1-1.41 0Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}