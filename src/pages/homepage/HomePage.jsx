import CardGame from "../../components/CardGame";
import useFetchSolution from "../../hook/useFetchSolution";

export default function HomePage() {
  const initialUrl =
    "https://api.rawg.io/api/games?key=6741a5ee1d0b42929ef2b37f6b920f20&dates=2024-01-01,2024-12-31&page=1";

  const { data, loading, error } = useFetchSolution(initialUrl);

  return (
    <>
      <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl">
        HomePage
      </button>
      <div className="grid-games-list">
        {loading && <p>Caricamento...</p>}
        {error && <article>{error}</article>}
        {data &&
          data.results.map((game) => <CardGame key={game.id} game={game} />)}
      </div>
    </>
  );
}
