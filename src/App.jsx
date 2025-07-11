import { Routing } from "./routes/Routing";
import SessionProvider from "./context/SessionProvider";
import FavoritesProvider from "./context/FavoritesProvider";
import "./Global.css";

export default function App() {
  return (
    <>
    <SessionProvider>
      <FavoritesProvider>
        <Routing />
      </FavoritesProvider>
    </SessionProvider>
    </>
  );
}
