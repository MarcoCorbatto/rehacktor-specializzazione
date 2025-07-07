import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import CardGame from "../../components/CardGame";
import useFetchSolution from "../../hook/useFetchSolution";

export default function SearchPage() {
  let [searchParams] = useSearchParams();
  const game = searchParams.get("query");

  const initialUrl =
    `https://api.rawg.io/api/games?key=6741a5ee1d0b42929ef2b37f6b920f20&search=${game}`;

  const { loading, data, error, updateUrl } = useFetchSolution(initialUrl);

  useEffect(() => {
    updateUrl(initialUrl);
  }, [initialUrl, updateUrl]);

  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Risultati per: <span className="text-primary">{game}</span>
      </h1>

      {loading && (
        <p className="col-span-full text-center text-xl text-gray-600">
          Caricamento giochi...
        </p>
      )}
      {error && (
        <p className="col-span-full text-red-500 text-xl text-center">
          Errore nel caricamento dei giochi: {error.message || error}
        </p>
      )}
      {data && data.results.length === 0 && !loading && (
        <p className="col-span-full text-center text-gray-500 text-xl">
          Nessun gioco trovato.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {data &&
          data.results.map((game) => <CardGame key={game.id} game={game} />)}
      </div>
    </div>
  );
}

