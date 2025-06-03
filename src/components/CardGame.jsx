import LazyLoadGameImage from "./LazyLoadGameImage";

export default function CardGame({ game }) {
  const genres = game.genres.map((genre) => genre.name).join(", ");

  const { background_image: image } = game;

  return (
    <article key={game.id}>
      <LazyLoadGameImage image={image} />
      <strong>{game.name}</strong>
      <small>{genres}</small>
      <p>{game.released}</p>
      <button>Visita il gioco</button>
    </article>
  );
}
