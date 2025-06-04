import { useState, useEffect } from "react";
import { useParams } from "react-router";
import useFetchSolution from "../../hook/useFetchSolution";
import CardGame from "../../components/CardGame";

export default function GenrePage() {
  const { genre } = useParams();

  // const [data, setData] = useState(null);
  // const [error, setError] = useState(null);

  const initialUrl =
    "https://api.rawg.io/api/games?key=6741a5ee1d0b42929ef2b37f6b920f20&genres=${genre}&page=1";

    const { data, loading, error, updateUrl } = useFetchSolution(initialUrl);

  // const load = async () => {
  //   try {
  //     const response = await fetch(initialUrl);
  //     if (!response.ok) {
  //       throw new Error(response.statusText);
  //     }
  //     const json = await response.json();
  //     setData(json);
  //   } catch (error) {
  //     setError(error.message);
  //     setData(null);
  //   }
  // };

  useEffect(() => {
    // load();
    const newUrl = "https://api.rawg.io/api/games?key=6741a5ee1d0b42929ef2b37f6b920f20&genres=${genre}&page=1";
    updateUrl(newUrl);
  }, [genre]);

  return (
    <>
      <h2>Welcome to {genre} page</h2>
      <div className="grid-games-list">
        {loading && <p>Caricamento...</p>}
        {error && <article>{error}</article>}
        {data &&
          data.results.map((game) => <CardGame key={game.id} game={game} />)}
      </div>
    </>
  );
}
