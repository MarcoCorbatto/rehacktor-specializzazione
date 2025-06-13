import { createContext, useState, useEffect, useCallback } from "react";
import supabase from "../supabase/supabase-client"; // Assicurati del path

export const FavoritesContext = createContext();

export default function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const getFavorites = useCallback(async () => {
    if (!session) return;
    const { data: favourites, error } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", session.user.id);

    if (!error) {
      setFavorites(favourites);
    } else {
      console.error("Errore nel recupero dei preferiti:", error);
    }
  }, [session]);

  const addFavorites = async (game) => {
    if (!session) return;
    await supabase
      .from("favorites")
      .insert([{
        user_id: session.user.id,
        game_id: game.id,
        game_name: game.name,
        game_image: game.background_image,
      }]);
  };

  const removeFavorite = async (gameId) => {
    if (!session) return;
    await supabase
      .from("favorites")
      .delete()
      .eq("game_id", gameId)
      .eq("user_id", session.user.id);
  };

  useEffect(() => {
    if (session) {
      getFavorites();
      const favoritesChannel = supabase
        .channel("favorites")
        .on("postgres_changes", { event: "*", schema: "public", table: "favorites" }, getFavorites)
        .subscribe();

      return () => {
        supabase.removeChannel(favoritesChannel);
      };
    }
  }, [session, getFavorites]);

  return (
    <FavoritesContext.Provider
      value={{ favorites, setFavorites, addFavorites, removeFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}
