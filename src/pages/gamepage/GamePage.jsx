import { useEffect } from "react";
import { useParams } from "react-router";
import useFetchSolution from "../../hook/useFetchSolution";
import supabase from "../../supabase/supabase-client";

export default function GamePage() {
  const { id } = useParams();

  const initialUrl = `https://api.rawg.io/api/games/${id}?key=6741a5ee1d0b42929ef2b37f6b920f20`;

  const { data, loading, error, updateUrl } = useFetchSolution(initialUrl);

  useEffect(() => {
    const newUrl = `https://api.rawg.io/api/games/${id}?key=6741a5ee1d0b42929ef2b37f6b920f20`;
    updateUrl(newUrl);
  }, [id]);

  const handleAddFavorites = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error("Errore autenticazione:", userError.message);
      alert("Devi fare il login per aggiungere ai preferiti.");
      return;
    }

    const userId = userData?.user?.id;

    const { error } = await supabase
      .from("favorites")
      .insert([
        {
          user_id: userId,
          game_id: id,
        },
      ]);

    if (error) {
      console.error("Errore inserimento:", error.message);
      alert("Errore durante l'aggiunta ai preferiti.");
    } else {
      alert("Gioco aggiunto ai preferiti!");
    }
  };

  return (
    <>
      {loading && <p>Caricamento...</p>}
      {error && <h1>{error}</h1>}
      {data && (
        <div className="style-gamepage">
          <div className="style-game-info">
            <p>{data.released}</p>
            <h1>{data.name}</h1>
            <p>Rating: {data.rating}</p>
            <p>About :</p>
            <p>{data.description_raw}</p>

            <button className="btn btn-primary mt-4" onClick={handleAddFavorites}>
              ❤️ Aggiungi ai preferiti
            </button>
          </div>
          <div className="style-game-image">
            <img src={data.background_image} alt={data.name} />
          </div>
        </div>
      )}
    </>
  );
}
