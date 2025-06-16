import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useFetchSolution from "../../hook/useFetchSolution";
import CardGame from "../../components/CardGame";

export default function GenrePage() {
  const { genre } = useParams();

  const initialUrl =
     `https://api.rawg.io/api/games?key=6741a5ee1d0b42929ef2b37f6b920f20&genres=${genre}&page=1`;


  const { data, loading, error, updateUrl } = useFetchSolution(initialUrl);

  useEffect(() => {
    const newUrl =
       `https://api.rawg.io/api/games?key=6741a5ee1d0b42929ef2b37f6b920f20&genres=${genre}&page=1`; 
    updateUrl(newUrl);
  }, [genre]);

  return (
    <div className="p-4">
      <div className="text-center mb-6">
        <h2 className="text-4xl font-bold capitalize text-primary">
          Welcome to {genre} games
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          Discover the best {genre} games
        </p>
      </div>

      {loading && (
        <div className="flex justify-center items-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      )}

      {error && (
        <div className="alert alert-error mt-4">
          <span>Error: {error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {data &&
          data.results.map((game) => <CardGame key={game.id} game={game} />)}
      </div>
    </div>
  );
}
