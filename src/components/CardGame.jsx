import LazyLoadGameImage from "./LazyLoadGameImage";

export default function CardGame({ game }) {
  return (
    <div className="card bg-base-100 w-96 shadow-sm">
      <figure>
        <LazyLoadGameImage
          image={game.background_image}
          alt={game.name}
          className="h-48 w-full object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {game.name}
          <div className="badge badge-secondary">NEW</div>
        </h2>
        <p>Uscita: {game.released}</p>
        <div className="card-actions justify-end">
          {game.genres?.map((genre) => (
            <div key={genre.id} className="badge badge-outline">
              {genre.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

