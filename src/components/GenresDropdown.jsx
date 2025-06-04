import { useState, useEffect } from "react";
import { Link } from "react-router";
import useFetchSolution from "../hook/useFetchSolution";

export default function GenresDropdown() {
  // const [genres, setGenres] = useState(null);
  // const [error, setError] = useState(null);

  const initialUrl =
    "https://api.rawg.io/api/genres?key=6741a5ee1d0b42929ef2b37f6b920f20";

    const { data, loading, error, updateUrl } = useFetchSolution(initialUrl);


  // useEffect(() => {
  //   const load = async () => {
  //     try {
  //       const response = await fetch(initialUrl);
  //       if (!response.ok) {
  //         throw new Error(response.statusText);
  //       }
  //       const json = await response.json();
  //       setGenres(json);
  //     } catch (error) {
  //       setError(error.message);
  //       setGenres(null);
  //     }
  //   };
  //   load();
  // }, []);

  return (
    <details className="dropdown">
      <summary>Genres</summary>
      {loading && <small>Caricamento...</small>}
      {error && <small>{error}</small>}
      <ul>
        {data &&
          data.results.map((genre) => (
            <li key={genre.id}>
              <Link to={`/games/${genre.slug}`}>{genre.name}</Link>
            </li>
          ))}
      </ul>
    </details>
  );
}
