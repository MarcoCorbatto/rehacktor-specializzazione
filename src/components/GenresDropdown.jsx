import { Link } from "react-router";
import useFetchSolution from "../hook/useFetchSolution";

export default function GenresDropdown() {
  const initialUrl =
    "https://api.rawg.io/api/genres?key=6741a5ee1d0b42929ef2b37f6b920f20";

  const { data, loading, error } = useFetchSolution(initialUrl);

  return (
    <div className="dropdown dropdown-hover">
      <div tabIndex={0} role="button" className="btn btn-ghost">
        Genres
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-56"
      >
        {loading && (
          <li>
            <small className="px-2">Loading...</small>
          </li>
        )}
        {error && (
          <li>
            <small className="px-2 text-error">{error}</small>
          </li>
        )}
        {data &&
          data.results.map((genre) => (
            <li key={genre.id}>
              <Link to={`/games/${genre.slug}`} className="capitalize">
                {genre.name}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}
