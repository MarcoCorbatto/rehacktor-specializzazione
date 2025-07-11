import { useParams } from "react-router-dom";
import { useState } from "react";
import useFetchSolution from "../../hook/useFetchSolution";
import supabase from "../../supabase/supabase-client";
import Chatbox from "../../components/Chatbox";
import Alert from "../../components/Alert";

export default function GamePage() {
  const { id } = useParams();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  const initialUrl = `https://api.rawg.io/api/games/${id}?key=6741a5ee1d0b42929ef2b37f6b920f20`;
  const { data, loading, error } = useFetchSolution(initialUrl);

  const showCustomAlert = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 3000); // auto-hide 
  };

  const handleAddFavorites = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error("Authentication error:", userError.message);
      showCustomAlert("You must be logged in to add to favorites.", "error");
      return;
    }

    const userId = userData?.user?.id;

    const { data: existingFavorite, error: checkError } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", userId)
      .eq("game_id", id)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking favorites:", checkError.message);
      showCustomAlert("Error while checking favorites.", "error");
      return;
    }

    if (existingFavorite) {
      showCustomAlert("This game is already in your favorites.", "warning");
      return;
    }

    const { error: insertError } = await supabase.from("favorites").insert([
      {
        user_id: userId,
        game_id: id,
        game_name: data.name,
        game_image: data.background_image,
      },
    ]);

    if (insertError) {
      console.error("Error inserting favorite:", insertError.message);
      showCustomAlert("Failed to add to favorites.", "error");
    } else {
      showCustomAlert("Game added to favorites!");
    }
  };

  return (
    <>
      {/* ALERT COMPONENT */}
      {showAlert && (
        <div className="fixed top-4 right-4 z-50">
          <Alert
            message={alertMessage}
            type={alertType}
            onClose={() => setShowAlert(false)}
          />
        </div>
      )}

      {/* LOADING / ERROR / MAIN CONTENT NON TOCCARE PIU QUI */}
      {loading && (
        <p className="text-center text-xl mt-8">Loading game details...</p>
      )}
      {error && (
        <h1 className="text-center text-red-500 text-2xl mt-8">
          Failed to load game: {error.message || error}
        </h1>
      )}

      {data && (
        <div className="container mx-auto px-4 py-8">
        
          <div
            className="relative w-full h-80 md:h-96 lg:h-[500px] bg-cover bg-center rounded-lg shadow-xl overflow-hidden mb-8"
            style={{ backgroundImage: `url(${data.background_image})` }}
          >
            <div className="absolute inset-0 bg-opacity-50 flex items-end p-6">
              <h1 className="text-white text-3xl md:text-5xl font-bold drop-shadow-lg">
                {data.name}
              </h1>
            </div>
          </div>

          {/* Page Layout */}
          <div className="flex flex-col lg:flex-row lg:gap-8 mb-8">
          
            <div className="lg:w-2/3 flex flex-col gap-6">
              <div className="card bg-base-100 shadow-xl p-6">
                <h2 className="text-2xl font-bold mb-4">About this game</h2>
                <p className="text-gray-700 leading-relaxed text-justify">
                  {data.description_raw}
                </p>
              </div>

              <Chatbox data={data} />
            </div>

         
            <div className="lg:w-1/3 mt-8 lg:mt-0">
              <div className="card bg-base-100 shadow-xl p-6">
                <h2 className="text-2xl font-bold mb-4">Game Details</h2>
                <p className="text-md mb-2">
                  <strong className="font-semibold">Release Date:</strong>{" "}
                  {data.released}
                </p>
                {data.rating > 0 && (
                  <p className="text-md mb-2">
                    <strong className="font-semibold">Rating:</strong>{" "}
                    {data.rating.toFixed(2)}
                  </p>
                )}

                {data.genres && data.genres.length > 0 && (
                  <div className="mt-4">
                    <p className="text-md mb-2">
                      <strong className="font-semibold">Genres:</strong>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {data.genres.map((genre) => (
                        <span
                          key={genre.id}
                          className="badge badge-primary"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  className="btn btn-primary mt-6 w-full"
                  onClick={handleAddFavorites}
                >
                  ❤️ Add to favorites
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
