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
    <form onSubmit={handleSearch} className="flex items-center gap-2">
      <input
        type="text"
        name="search"
        placeholder={showError ? "Devi cercare qualcosa!" : "Search games..."}
        onChange={(e) => {
          setSearch(e.target.value);
          if (e.target.value.trim().length > 0) setShowError(false);
        }}
        value={search}
        className={`input input-bordered w-52 md:w-64 ${
          showError ? "input-error" : ""
        }`}
        aria-invalid={showError ? "true" : "false"}
      />
      <button
        type="submit"
        className="btn btn-primary btn-sm"
        aria-label="Search"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
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
      {showError && (
        <p className="text-error text-sm ml-2">
          The search field cannot be empty
        </p>
      )}
    </form>
  );
}
