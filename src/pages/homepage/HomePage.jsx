import CardGame from "../../components/CardGame";
import useFetchSolution from "../../hook/useFetchSolution";

export default function HomePage() {
  const initialUrl =
    `https://api.rawg.io/api/games?key=6741a5ee1d0b42929ef2b37f6b920f20&dates=2024-01-01,2024-12-31&page=1`;

  const { data, loading, error } = useFetchSolution(initialUrl);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
        {loading && <p>Caricamento...</p>}
        {error && <article>{error}</article>}
        {data &&
          data.results.map((game) => <CardGame key={game.id} game={game} />)}
      </div>
    </>
  );
}
