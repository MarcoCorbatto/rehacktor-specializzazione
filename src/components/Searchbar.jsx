import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Searchbar() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showError, setShowError] = useState(false);

  const handleSearch = (event) => {
    event.preventDefault();
    const trimmedSearch = search.trim();

    if (trimmedSearch.length !== 0) {
      navigate(`/search?query=${trimmedSearch}`);
      setSearch("");
      setShowError(false);
    } else {
      setShowError(true);
    }
  };

  return (
    <form onSubmit={handleSearch} className="form-control">
      <div className="input-group">
        <input
          type="text"
          name="search"
          placeholder={showError ? "Devi cercare qualcosa!" : "Search games..."}
          onChange={(event) => {
            setSearch(event.target.value);
            if (event.target.value.trim().length > 0) setShowError(false);
          }}
          value={search}
          className={`input input-bordered w-full ${
            showError ? "input-error" : ""
          }`}
          aria-invalid={showError ? "true" : "false"}
        />
        <button type="submit" className="btn btn-square btn-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
        </button>
      </div>
      {showError && (
        <p className="text-error text-sm mt-1">
          Il campo di ricerca non può essere vuoto.
        </p>
      )}
    </form>
  );
}
