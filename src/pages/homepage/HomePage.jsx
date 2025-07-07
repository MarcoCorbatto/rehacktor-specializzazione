import CardGame from "../../components/CardGame";
import useFetchSolution from "../../hook/useFetchSolution";

export default function HomePage() {
  const initialUrl =
    `https://api.rawg.io/api/games?key=6741a5ee1d0b42929ef2b37f6b920f20&dates=2024-01-01,2024-12-31&page=1`;

  const { data, loading, error } = useFetchSolution(initialUrl);

 return (
    <div className="min-h-screen bg-base-200 px-4 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-primary">🎮 Discover Top Games</h1>
          <p className="mt-2 text-lg text-base-content">Stay updated with the best games of the year.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {loading && (
            <span className="loading loading-ring loading-lg col-span-full mx-auto" />
          )}

          {error && (
            <div className="alert alert-error col-span-full">
              <span>Error: {error.message || error}</span>
            </div>
          )}

          {data && data.results.length === 0 && !loading && (
            <div className="alert alert-warning col-span-full">
              <span>No new game.</span>
            </div>
          )}

          {data &&
            data.results.map((game) => (
              <CardGame key={game.id} game={game} />
            ))}
        </div>
      </div>
    </div>
  );
}