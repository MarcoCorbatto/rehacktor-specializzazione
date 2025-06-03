import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "../pages/homepage/HomePage";
import Layout from "../layout/Layout";
import ErrorPage from "../pages/error/ErrorPage";
import GamePage from "../pages/gamepage/GamePage";
import GenrePage from "../pages/genrepage/GenrePage";


export function Routing() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<ErrorPage />} />
          <Route path="/games/:genre" element={<GenrePage />} />
          <Route path="/games/:slug/:id" element={<GamePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
