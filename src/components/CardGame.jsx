import LazyLoadGameImage from "./LazyLoadGameImage";

export default function CardGame({ game }) {
  return (
    <div className="card bg-base-100 shadow-md w-full h-full">
      <figure className="h-48 overflow-hidden">
        <LazyLoadGameImage
          image={game.background_image}
          alt={game.name}
          className="w-full h-full object-cover"
        />
      </figure>
      <div className="card-body flex flex-col justify-between">
        <div>
          <h2 className="card-title text-base">
            {game.name}
            <div className="badge badge-secondary">NEW</div>
          </h2>
          <p className="text-sm text-gray-600">Uscita: {game.released}</p>
        </div>
        <div className="card-actions mt-4 flex-wrap gap-2">
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


