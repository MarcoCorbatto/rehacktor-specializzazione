import Alert from "./Alert";
import { useState } from "react";
import { Link } from "react-router-dom";
import LazyLoadGameImage from "./LazyLoadGameImage";
import supabase from "../supabase/supabase-client";

export default function CardGame({ game }) {
  const [alert, setAlert] = useState(null);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000); 
  };

  const handleAddToFavorites = async (event) => {
    event.stopPropagation();
    event.preventDefault();

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error("Error login:", userError.message);
      showAlert("error", "You must log in.");
      return;
    }

    const userId = userData?.user?.id;

    const { data: existingFavorite, error: checkError } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", userId)
      .eq("game_id", game.id)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 = nota 2 no results found no risultati ricordati questo codiceee
      console.error("Error while verifying favorites:", checkError.message);
      showAlert("error", "Error while verifying favorites.");
      return;
    }

    if (existingFavorite) {
      showAlert("warning", "This game is already in your favorites!");
      return;
    }

    const { error: insertError } = await supabase
      .from("favorites")
      .insert([{ user_id: userId, game_id: game.id }]);

    if (insertError) {
      console.error("Error Insert:", insertError.message);
      showAlert("error", "Error adding to favorites.");
    } else {
      showAlert("success", "Game added to favorites!");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getBadgeClass = (index) => {
    const colors = [
      "badge-primary",
      "badge-secondary",
      "badge-accent",
      "badge-info",
    ];
    return colors[index % colors.length];
  };

  return (
    <>
      {/* ALERT */}
      {alert && (
        <div className="fixed top-4 right-4 z-50">
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        </div>
      )}

      {/* CARDdd */}
      <Link
        to={`/games/${game.slug}/${game.id}`}
        className="flex flex-col h-full"
      >
        <div className="card bg-base-100 shadow-xl w-full min-h-[400px] flex flex-col transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-2xl overflow-hidden">
          <figure className="h-48 overflow-hidden rounded-t-lg relative">
            <LazyLoadGameImage
              image={game.background_image}
              alt={game.name}
              className="w-full h-full object-cover"
            />
            <button
              onClick={handleAddToFavorites}
              className="absolute top-2 right-2 btn btn-sm btn-primary"
              title="Add to favorites"
            >
              ❤️
            </button>
          </figure>

          <div className="card-body flex flex-col justify-between p-4 flex-grow">
            <div>
              <h2 className="card-title text-lg font-semibold mb-1 truncate">
                {game.name}
              </h2>
              <p className="text-sm text-gray-600">Release: {formatDate(game.released)}</p>
              {game.rating > 0 && (
                <p className="text-sm text-gray-600">
                  Rating: {game.rating.toFixed(2)}
                </p>
              )}
            </div>

            {game.genres && game.genres.length > 0 && (
              <div className="card-actions mt-3 flex flex-wrap gap-2 justify-start">
                {game.genres.slice(0, 3).map((genre, index) => (
                  <div
                    key={genre.id}
                    className={`badge badge-outline ${getBadgeClass(
                      index
                    )} text-xs px-2 py-1`}
                  >
                    {genre.name}
                  </div>
                ))}
                {game.genres.length > 3 && (
                  <div className="badge badge-outline text-xs px-2 py-1">...</div>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </>
  );
}
