import CardGame from "../../components/CardGame";
import useFetchSolution from "../../hook/useFetchSolution";

export default function HomePage() {
  const initialUrl =
    `https://api.rawg.io/api/games?key=6741a5ee1d0b42929ef2b37f6b920f20&dates=2024-01-01,2024-12-31&page=1`;

  const { data, loading, error } = useFetchSolution(initialUrl);

return (
    //  div per un layout generale più pulito e con padding
    <div className="container mx-auto px-4 py-8"> 
      <h1 className="text-3xl font-bold mb-6 text-center">Giochi</h1> 
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
        {loading && <p className="col-span-full text-center text-xl text-gray-600">Caricamento giochi...</p>}
        {error && <p className="col-span-full text-center text-red-500 text-xl">Errore nel caricamento dei giochi: {error.message || error}</p>}
        {data && data.results.length === 0 && !loading && (
          <p className="col-span-full text-center text-gray-500 text-xl">Nessun gioco trovato per il 2024.</p>
        )}
        {data &&
          data.results.map((game) => <CardGame key={game.id} game={game} />)}
      </div>
    </div>
  );
}