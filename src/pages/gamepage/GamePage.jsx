import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useFetchSolution from "../../hook/useFetchSolution";
import supabase from "../../supabase/supabase-client";
import Chatbox from "../../components/Chatbox";

export default function GamePage() {
  const { id } = useParams();

  const initialUrl = `https://api.rawg.io/api/games/${id}?key=6741a5ee1d0b42929ef2b37f6b920f20`;

  const { data, loading, error } = useFetchSolution(initialUrl);
  
  const handleAddFavorites = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error("Errore autenticazione:", userError.message);
      alert("Devi fare il login per aggiungere ai preferiti.");
      return;
    }

    const userId = userData?.user?.id;

    const { data: existingFavorite, error: checkError } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", userId)
      .eq("game_id", id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
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
      .insert([
        {
          user_id: userId,
          game_id: id,
          game_name: data.name, //  'data' disponibile qui
          game_image: data.background_image, //   'data' sia disponibile qui
        },
      ]);

    if (insertError) {
      console.error("Errore inserimento:", insertError.message);
      alert("Errore durante l'aggiunta ai preferiti.");
    } else {
      alert("Gioco aggiunto ai preferiti!");
    }
  };

  return (
    <>
      {loading && <p className="text-center text-xl mt-8">Caricamento dettagli gioco...</p>}
      {error && <h1 className="text-center text-red-500 text-2xl mt-8">Errore nel caricamento del gioco: {error.message || error}</h1>}

      {data && (
        <div className="container mx-auto px-4 py-8"> 
          {/* Sezione titolo e immagine di sfondo del gioco */}
          <div className="relative w-full h-80 md:h-96 lg:h-[500px] bg-cover bg-center rounded-lg shadow-xl overflow-hidden mb-8"
               style={{ backgroundImage: `url(${data.background_image})` }}>
            <div className="absolute inset-0 bg-opacity-50 flex items-end p-6">
              <h1 className="text-white text-3xl md:text-5xl font-bold drop-shadow-lg">{data.name}</h1>
            </div>
          </div>
          <div>
          </div>

         
          <div className="flex flex-col lg:flex-row lg:gap-8 mb-8">
            {/* Colonna sinistra: Descrizione e About */}
            <div className="lg:w-2/3 flex flex-col gap-6">
              <div className="card bg-base-100 shadow-xl p-6">
                <h2 className="text-2xl font-bold mb-4">About this game</h2>
                <p className="text-gray-700 leading-relaxed text-justify">{data.description_raw}</p>
              </div>

              {/* Chat del gioco -  */}
              <Chatbox data={data} />
            </div>

            
            <div className="lg:w-1/3 mt-8 lg:mt-0">
              <div className="card bg-base-100 shadow-xl p-6">
                <h2 className="text-2xl font-bold mb-4">Game Details</h2>
                <p className="text-md mb-2"><strong className="font-semibold">Release Date:</strong> {data.released}</p>
                {data.rating > 0 && <p className="text-md mb-2"><strong className="font-semibold">Rating:</strong> {data.rating.toFixed(2)}</p>}
                
                {data.genres && data.genres.length > 0 && (
                  <div className="mt-4">
                    <p className="text-md mb-2"><strong className="font-semibold">Genres:</strong></p>
                    <div className="flex flex-wrap gap-2">
                      {data.genres.map(genre => (
                        <span key={genre.id} className="badge badge-primary">{genre.name}</span>
                      ))}
                    </div>
                  </div>
                )}

                <button className="btn btn-primary mt-6 w-full" onClick={handleAddFavorites}>
                  ❤️ Aggiungi ai preferiti
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}